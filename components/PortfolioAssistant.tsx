"use client";

import {
  Bot,
  MessageCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Fragment, type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import {
  ASSISTANT_LIMITS,
  ASSISTANT_SESSION_KEY,
  assistantInitialMessage,
  assistantQuickPrompts,
  blockedMessage,
  getPortfolioAssistantReply,
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

const initialMessages: AssistantMessage[] = [
  {
    id: "assistant-initial",
    role: "assistant",
    content: assistantInitialMessage,
  },
];

const initialLimits: LimitState = {
  questionsUsed: 0,
  outOfScopeCount: 0,
  blocked: false,
};

const linkTokens = [
  {
    token: "[sergiocareyhola@gmail.com](mailto:sergiocareyhola@gmail.com)",
    label: "sergiocareyhola@gmail.com",
    href: "mailto:sergiocareyhola@gmail.com",
  },
  {
    token: "https://github.com/SC-Sergio",
    label: "GitHub",
    href: "https://github.com/SC-Sergio",
  },
  {
    token: "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sergio-enrique-carey-alegre-58b318174/",
  },
  {
    token: "https://sergio-portfolio-v2-roan.vercel.app",
    label: "Portafolio publicado",
    href: "https://sergio-portfolio-v2-roan.vercel.app",
  },
];

function isStoredLimitState(value: unknown): value is LimitState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<LimitState>;
  return (
    typeof candidate.questionsUsed === "number" &&
    typeof candidate.outOfScopeCount === "number" &&
    typeof candidate.blocked === "boolean"
  );
}

function readStoredLimitState(): LimitState {
  try {
    if (typeof window === "undefined") {
      return initialLimits;
    }

    const storedLimits = sessionStorage.getItem(ASSISTANT_SESSION_KEY);

    if (!storedLimits) {
      return initialLimits;
    }

    const parsedLimits: unknown = JSON.parse(storedLimits);

    if (!isStoredLimitState(parsedLimits)) {
      return initialLimits;
    }

    return {
      questionsUsed: Math.min(parsedLimits.questionsUsed, ASSISTANT_LIMITS.maxQuestions),
      outOfScopeCount: Math.min(
        parsedLimits.outOfScopeCount,
        ASSISTANT_LIMITS.maxOutOfScope,
      ),
      blocked: parsedLimits.blocked,
    };
  } catch {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ASSISTANT_SESSION_KEY);
    }

    return initialLimits;
  }
}

function renderLinkedText(content: string): ReactNode {
  let parts: ReactNode[] = [content];

  linkTokens.forEach(({ token, label, href }) => {
    parts = parts.flatMap((part, index) => {
      if (typeof part !== "string" || !part.includes(token)) {
        return [part];
      }

      const segments = part.split(token);
      return segments.flatMap((segment, segmentIndex) => {
        const output: ReactNode[] = [];

        if (segment) {
          output.push(
            <Fragment key={`${token}-text-${index}-${segmentIndex}`}>
              {segment}
            </Fragment>,
          );
        }

        if (segmentIndex < segments.length - 1) {
          output.push(
            <a
              key={`${token}-link-${index}-${segmentIndex}`}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="font-medium text-cyan-200 underline decoration-cyan-300/50 underline-offset-4 transition-colors hover:text-white"
            >
              {label}
            </a>,
          );
        }

        return output;
      });
    });
  });

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const lastQuestionAtRef = useRef(Number.NEGATIVE_INFINITY);
  const hasLoadedSessionRef = useRef(false);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasLoadedSessionRef.current) {
      return;
    }

    sessionStorage.setItem(ASSISTANT_SESSION_KEY, JSON.stringify(limits));
  }, [limits]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  const nextMessageId = (prefix: string) => {
    messageIdRef.current += 1;
    return `${prefix}-${messageIdRef.current}`;
  };

  const appendAssistantMessage = (content: string, tone: AssistantMessage["tone"] = "default") => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId("assistant"),
        role: "assistant",
        content,
        tone,
      },
    ]);
  };

  const resetChat = () => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
    }

    setMessages(initialMessages);
    setLimits(initialLimits);
    setInput("");
    setNotice(null);
    setIsTyping(false);
    lastQuestionAtRef.current = Number.NEGATIVE_INFINITY;
    hasLoadedSessionRef.current = true;
    sessionStorage.removeItem(ASSISTANT_SESSION_KEY);
    window.setTimeout(() => inputRef.current?.focus(), 80);
  };

  const toggleAssistant = () => {
    if (!isOpen && !hasLoadedSessionRef.current) {
      setLimits(readStoredLimitState());
      hasLoadedSessionRef.current = true;
    }

    setIsOpen((currentValue) => !currentValue);
  };

  const submitQuestion = (rawQuestion: string, eventTime: number) => {
    const question = rawQuestion.trim();

    if (!question || isTyping) {
      return;
    }

    if (question.length > ASSISTANT_LIMITS.maxCharacters) {
      setNotice("Tu pregunta supera los 280 caracteres. Acórtala para mantener esta demo liviana.");
      return;
    }

    if (limits.blocked) {
      setNotice("El chat está pausado por seguridad. Usa “Reiniciar chat” para volver al contexto del portafolio.");
      appendAssistantMessage(blockedMessage, "error");
      return;
    }

    if (limits.questionsUsed >= ASSISTANT_LIMITS.maxQuestions) {
      setNotice("Límite de preguntas alcanzado en esta sesión.");
      appendAssistantMessage(limitReachedMessage, "warning");
      return;
    }

    const now = eventTime;
    if (now - lastQuestionAtRef.current < ASSISTANT_LIMITS.cooldownMs) {
      setNotice("Espera un momento antes de enviar otra pregunta.");
      return;
    }

    setNotice(null);
    setInput("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId("user"),
        role: "user",
        content: question,
      },
    ]);

    const reply = getPortfolioAssistantReply(question);
    const nextLimits: LimitState = {
      ...limits,
      questionsUsed: limits.questionsUsed + 1,
    };

    let finalReply = reply.text;
    let finalTone: AssistantMessage["tone"] =
      reply.status === "out-of-scope" ? "warning" : "default";

    if (reply.status === "out-of-scope") {
      const nextOutOfScopeCount = limits.outOfScopeCount + 1;
      nextLimits.outOfScopeCount = Math.min(
        nextOutOfScopeCount,
        ASSISTANT_LIMITS.maxOutOfScope,
      );

      if (nextOutOfScopeCount > ASSISTANT_LIMITS.maxOutOfScope) {
        nextLimits.blocked = true;
        finalReply = blockedMessage;
        finalTone = "error";
      }
    }

    setLimits(nextLimits);
    lastQuestionAtRef.current = now;
    setIsTyping(true);

    responseTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      appendAssistantMessage(finalReply, finalTone);
    }, 520);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(input, event.timeStamp);
  };

  const remainingQuestions = ASSISTANT_LIMITS.maxQuestions - limits.questionsUsed;
  const isInputDisabled = isTyping || limits.blocked;

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end sm:left-auto">
      {isOpen ? (
        <section
          aria-labelledby="portfolio-assistant-title"
          aria-modal="false"
          role="dialog"
          className="pointer-events-auto mb-3 flex max-h-[calc(100svh-6rem)] w-full max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-cyan-100/20 bg-[#061014]/95 shadow-2xl shadow-black/70 ring-1 ring-white/10 backdrop-blur-md sm:w-[26rem]"
        >
          <header className="flex items-start justify-between gap-4 border-b border-cyan-100/15 bg-slate-950/75 p-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                <Sparkles aria-hidden="true" size={14} />
                Demo local
              </div>
              <h2 id="portfolio-assistant-title" className="mt-1 text-base font-semibold text-white">
                Asistente del portafolio
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                Respuestas controladas sobre perfil, proyectos, stack y contacto.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-cyan-100/20 bg-slate-900/90 p-2 text-slate-100 transition-colors hover:border-cyan-200/55 hover:bg-cyan-200/15"
              aria-label="Cerrar panel del asistente"
              title="Cerrar"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </header>

          <div
            className="min-h-0 flex-1 space-y-3 overflow-y-auto border-y border-white/[0.04] bg-[#03080b]/70 px-4 py-4"
            aria-live="polite"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              const toneClass =
                message.tone === "error"
                  ? "border-red-300/45 bg-red-950/80 text-red-50 shadow-sm shadow-black/30"
                  : message.tone === "warning"
                    ? "border-amber-300/45 bg-amber-950/75 text-amber-50 shadow-sm shadow-black/30"
                    : isUser
                      ? "border-emerald-200/45 bg-emerald-400/15 text-white shadow-sm shadow-black/30"
                      : "border-cyan-100/25 bg-slate-900/85 text-slate-100 shadow-sm shadow-black/30";

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] break-words rounded-2xl border px-3.5 py-2.5 text-sm leading-relaxed ${toneClass}`}
                  >
                    {renderLinkedText(message.content)}
                  </div>
                </div>
              );
            })}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-cyan-100/25 bg-slate-900/85 px-3.5 py-2.5 text-sm text-slate-100 shadow-sm shadow-black/30">
                  <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.65)]" />
                  Escribiendo respuesta demo...
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-cyan-100/15 bg-slate-950/75 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {assistantQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={(event) => submitQuestion(prompt, event.timeStamp)}
                  disabled={isInputDisabled}
                  className="rounded-full border border-cyan-100/18 bg-slate-900/85 px-3 py-1.5 text-left text-xs font-medium text-slate-100 shadow-sm shadow-black/20 transition-colors hover:border-cyan-200/45 hover:bg-cyan-200/12 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="portfolio-assistant-input" className="sr-only">
                Pregunta para el asistente del portafolio
              </label>
              <input
                ref={inputRef}
                id="portfolio-assistant-input"
                type="text"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (notice) {
                    setNotice(null);
                  }
                }}
                maxLength={ASSISTANT_LIMITS.maxCharacters + 40}
                disabled={isInputDisabled}
                placeholder={
                  limits.blocked
                    ? "Reinicia el chat para continuar"
                    : "Pregunta sobre Sergio"
                }
                className="min-w-0 flex-1 rounded-full border border-cyan-100/20 bg-slate-950/95 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-200/70 focus:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-55"
              />
              <button
                type="submit"
                disabled={!input.trim() || isInputDisabled}
                className="rounded-full border border-emerald-200/45 bg-emerald-300/20 p-2.5 text-emerald-50 shadow-sm shadow-emerald-950/40 transition-colors hover:border-emerald-200/70 hover:bg-emerald-300/30 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Enviar pregunta al asistente"
                title="Enviar"
              >
                <Send aria-hidden="true" size={18} />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" size={14} />
                {limits.blocked
                  ? "Chat pausado"
                  : `${Math.max(remainingQuestions, 0)}/${ASSISTANT_LIMITS.maxQuestions} preguntas disponibles`}
              </span>
              <button
                type="button"
                onClick={resetChat}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-cyan-100 transition-colors hover:bg-cyan-200/12 hover:text-white"
              >
                <RotateCcw aria-hidden="true" size={13} />
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
        type="button"
        onClick={toggleAssistant}
        className="glow-button pointer-events-auto inline-flex items-center gap-2 rounded-full border border-emerald-100/50 bg-emerald-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/30 transition-transform hover:-translate-y-0.5 hover:bg-emerald-200"
        aria-label={isOpen ? "Cerrar asistente del portafolio" : "Abrir asistente del portafolio"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X aria-hidden="true" size={18} /> : <MessageCircle aria-hidden="true" size={18} />}
        <span className="hidden sm:inline">{isOpen ? "Cerrar" : "Asistente"}</span>
        <Bot aria-hidden="true" className="sm:hidden" size={18} />
      </button>
    </div>
  );
}
