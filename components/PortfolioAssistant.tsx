"use client";

import { Bot, RotateCcw, Send, ShieldCheck, X } from "lucide-react";
import { type FormEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import {
  ASSISTANT_LIMITS,
  ASSISTANT_SESSION_KEY,
  assistantInitialMessage,
  assistantQuickPrompts,
  blockedMessage,
  getPortfolioAssistantReply,
  isAllowedAssistantHref,
  limitReachedMessage,
} from "@/data/assistant";

type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  tone?: "default" | "warning" | "error";
};

type LimitState = {
  questionsUsed: number;
  outOfScopeCount: number;
  blocked: boolean;
};

const initialMessages: AssistantMessage[] = [{ id: "assistant-initial", role: "assistant", content: assistantInitialMessage }];
const initialLimits: LimitState = { questionsUsed: 0, outOfScopeCount: 0, blocked: false };
const RESPONSE_DELAY_MS = 450;

function readStoredLimits(): LimitState {
  try {
    const raw = sessionStorage.getItem(ASSISTANT_SESSION_KEY);
    if (!raw) return initialLimits;
    const value = JSON.parse(raw) as Partial<LimitState>;
    if (typeof value.questionsUsed !== "number" || typeof value.outOfScopeCount !== "number" || typeof value.blocked !== "boolean") {
      return initialLimits;
    }
    return {
      questionsUsed: Math.min(Math.max(value.questionsUsed, 0), ASSISTANT_LIMITS.maxQuestions),
      outOfScopeCount: Math.min(Math.max(value.outOfScopeCount, 0), ASSISTANT_LIMITS.maxOutOfScope),
      blocked: value.blocked,
    };
  } catch {
    return initialLimits;
  }
}

function storeLimits(limits: LimitState) {
  try {
    sessionStorage.setItem(ASSISTANT_SESSION_KEY, JSON.stringify(limits));
  } catch {
    /* almacenamiento no disponible (modo privado): los límites viven solo en memoria */
  }
}

/** Convierte [texto](href) en enlaces solo si el destino está permitido; si no, deja el texto. */
function renderMessage(content: string, onInternalLink: () => void): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const [full, label, href] = match;
    if (match.index > lastIndex) parts.push(content.slice(lastIndex, match.index));

    if (isAllowedAssistantHref(href)) {
      const external = href.startsWith("http");
      const internal = href.startsWith("#");
      parts.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          onClick={internal ? onInternalLink : undefined}
          className="font-medium text-cyan-soft underline decoration-cyan/40 underline-offset-4 hover:text-white"
        >
          {label}
        </a>,
      );
    } else {
      parts.push(label);
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < content.length) parts.push(content.slice(lastIndex));
  return parts;
}

export default function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [limits, setLimits] = useState<LimitState>(initialLimits);
  const [isTyping, setIsTyping] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const lastQuestionAtRef = useRef(Number.NEGATIVE_INFINITY);
  const loadedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setIsOpen(false);
    if (restoreFocus) toggleRef.current?.focus();
  }, []);

  // Al seguir un enlace interno (#projects, /cv) el panel se cierra para mostrar el destino.
  const closeOnInternalLink = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    window.addEventListener("keydown", onKeyDown);
    inputRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, isTyping, isOpen]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const updateLimits = (next: LimitState) => {
    setLimits(next);
    storeLimits(next);
  };

  const nextId = (prefix: string) => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };

  const appendAssistant = (content: string, tone: AssistantMessage["tone"] = "default") => {
    setMessages((current) => [...current, { id: nextId("assistant"), role: "assistant", content, tone }]);
  };

  const toggle = () => {
    if (!isOpen && !loadedRef.current) {
      loadedRef.current = true;
      setLimits(readStoredLimits());
    }
    if (isOpen) {
      close(false);
    } else {
      setIsOpen(true);
    }
  };

  const resetChat = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessages(initialMessages);
    updateLimits(initialLimits);
    setInput("");
    setNotice(null);
    setIsTyping(false);
    lastQuestionAtRef.current = Number.NEGATIVE_INFINITY;
    inputRef.current?.focus();
  };

  const submitQuestion = (rawQuestion: string, eventTime: number) => {
    const question = rawQuestion.trim();
    if (!question || isTyping) return;

    if (question.length > ASSISTANT_LIMITS.maxCharacters) {
      setNotice(`La pregunta supera los ${ASSISTANT_LIMITS.maxCharacters} caracteres. Acórtala, por favor.`);
      return;
    }
    if (limits.blocked) {
      setNotice("El chat está pausado. Usa «Reiniciar chat» para continuar.");
      return;
    }
    if (limits.questionsUsed >= ASSISTANT_LIMITS.maxQuestions) {
      setNotice("Llegaste al límite de preguntas de esta sesión.");
      appendAssistant(limitReachedMessage, "warning");
      return;
    }
    if (eventTime - lastQuestionAtRef.current < ASSISTANT_LIMITS.cooldownMs) {
      setNotice("Espera un momento antes de enviar otra pregunta.");
      return;
    }

    setNotice(null);
    setInput("");
    setMessages((current) => [...current, { id: nextId("user"), role: "user", content: question }]);

    const reply = getPortfolioAssistantReply(question);
    const next: LimitState = { ...limits, questionsUsed: limits.questionsUsed + 1 };
    let text = reply.text;
    let tone: AssistantMessage["tone"] = reply.status === "out-of-scope" ? "warning" : "default";

    if (reply.status === "out-of-scope") {
      const count = limits.outOfScopeCount + 1;
      next.outOfScopeCount = Math.min(count, ASSISTANT_LIMITS.maxOutOfScope);
      if (count > ASSISTANT_LIMITS.maxOutOfScope) {
        next.blocked = true;
        text = blockedMessage;
        tone = "error";
      }
    }

    updateLimits(next);
    lastQuestionAtRef.current = eventTime;
    setIsTyping(true);
    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      appendAssistant(text, tone);
    }, RESPONSE_DELAY_MS);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(input, event.timeStamp);
  };

  const remaining = Math.max(ASSISTANT_LIMITS.maxQuestions - limits.questionsUsed, 0);
  const disabled = isTyping || limits.blocked;

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-40 flex flex-col items-end sm:inset-x-auto sm:bottom-5 sm:right-5">
      {isOpen ? (
        <section
          id="portfolio-assistant"
          role="dialog"
          aria-modal="false"
          aria-labelledby="portfolio-assistant-title"
          className="pointer-events-auto mb-3 flex max-h-[min(36rem,calc(100svh-10rem))] w-full flex-col overflow-hidden rounded-2xl border border-line-strong bg-[#070b12] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.85)] sm:w-[25rem]"
        >
          <header className="flex items-start justify-between gap-4 border-b border-line px-4 py-3.5">
            <div className="min-w-0">
              <h2 id="portfolio-assistant-title" className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <Bot size={17} className="text-cyan-soft" aria-hidden="true" />
                Asistente del portafolio
              </h2>
              <p className="mt-0.5 text-xs text-muted">Respuestas locales y verificadas. No usa APIs externas.</p>
            </div>
            <button
              type="button"
              onClick={() => close(true)}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-white/5 hover:text-ink"
              aria-label="Cerrar asistente"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </header>

          <div ref={logRef} role="log" aria-live="polite" aria-label="Conversación" className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4">
            {messages.map((message) => {
              const isUser = message.role === "user";
              const tone =
                message.tone === "error"
                  ? "border-red-400/40 bg-red-950/60 text-red-50"
                  : message.tone === "warning"
                    ? "border-amber-300/40 bg-amber-950/50 text-amber-50"
                    : isUser
                      ? "border-cyan/35 bg-cyan/10 text-ink"
                      : "border-line bg-surface-2 text-ink-soft";
              return (
                <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[88%] break-words rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed ${tone}`} data-role={message.role}>
                    <span className="sr-only">{isUser ? "Tú: " : "Asistente: "}</span>
                    {renderMessage(message.content, closeOnInternalLink)}
                  </p>
                </div>
              );
            })}
            {isTyping ? (
              <div className="flex justify-start">
                <p className="flex items-center gap-2 rounded-2xl border border-line bg-surface-2 px-3.5 py-2.5 text-sm text-muted">
                  <span className="size-1.5 animate-pulse rounded-full bg-cyan motion-reduce:animate-none" aria-hidden="true" />
                  Escribiendo…
                </p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-line px-4 pb-4 pt-3">
            <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible" aria-label="Preguntas sugeridas" role="group">
              {assistantQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={(event) => submitQuestion(prompt, event.timeStamp)}
                  disabled={disabled}
                  className="shrink-0 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-cyan/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="portfolio-assistant-input" className="sr-only">
                Pregunta para el asistente
              </label>
              <input
                ref={inputRef}
                id="portfolio-assistant-input"
                type="text"
                value={input}
                autoComplete="off"
                enterKeyHint="send"
                onChange={(event) => {
                  setInput(event.target.value);
                  if (notice) setNotice(null);
                }}
                maxLength={ASSISTANT_LIMITS.maxCharacters + 40}
                disabled={disabled}
                placeholder={limits.blocked ? "Reinicia el chat para continuar" : "Pregunta sobre Sergio…"}
                className="h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-bg px-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-cyan/60 disabled:cursor-not-allowed disabled:opacity-55 sm:text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || disabled}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-cyan text-[#021014] transition-colors hover:bg-cyan-soft disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar pregunta"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </form>

            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5" data-testid="assistant-remaining">
                <ShieldCheck size={13} aria-hidden="true" />
                {limits.blocked ? "Chat pausado" : `${remaining}/${ASSISTANT_LIMITS.maxQuestions} preguntas disponibles`}
              </span>
              <button
                type="button"
                onClick={resetChat}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-cyan-soft transition-colors hover:bg-white/5 hover:text-ink"
              >
                <RotateCcw size={12} aria-hidden="true" />
                Reiniciar chat
              </button>
            </div>
            {notice ? (
              <p className="mt-2 text-xs leading-relaxed text-amber-200" role="alert">
                {notice}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <button
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={isOpen ? "portfolio-assistant" : undefined}
        aria-label={isOpen ? "Cerrar asistente del portafolio" : "Abrir asistente del portafolio"}
        className="pointer-events-auto inline-flex h-12 items-center gap-2 rounded-full border border-cyan/40 bg-[#081018] px-4 text-sm font-semibold text-ink shadow-[0_12px_40px_-10px_rgba(34,211,238,0.45)] transition-colors hover:border-cyan/70"
      >
        {isOpen ? <X size={18} aria-hidden="true" /> : <Bot size={18} className="text-cyan-soft" aria-hidden="true" />}
        <span className="hidden sm:inline">{isOpen ? "Cerrar" : "Asistente"}</span>
      </button>
    </div>
  );
}
