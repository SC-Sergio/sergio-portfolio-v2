"use client";

import { Ban, ChevronRight, CircleDollarSign, Lock, PackagePlus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

// Prototipo conceptual independiente: marca genérica, reglas simplificadas y datos inventados.
// No reutiliza código, interfaz ni datos del sistema real. El estado vive en memoria y se pierde al recargar.

type Role = "recepcion" | "operario" | "admin";
type Status = "recibido" | "lavado" | "secado" | "listo" | "entregado";
type Method = "efectivo" | "tarjeta" | "transferencia";
type Line = { service: string; qty: number; unit: number };
type Order = { id: number; customer: string; lines: Line[]; status: Status; paid?: Method; createdAt: string };

const roles: Record<Role, { label: string; can: string[] }> = {
  recepcion: { label: "Recepción", can: ["crear pedidos", "cobrar en caja", "entregar pedidos listos y pagados"] },
  operario: { label: "Operario", can: ["avanzar pedidos por lavado, secado y listo"] },
  admin: { label: "Administración", can: ["todo lo anterior", "ver el panel y el cierre de caja"] },
};

const services = [
  { id: "lavado-kg", name: "Lavado por kilo", unit: 1800 },
  { id: "secado-kg", name: "Secado por kilo", unit: 1200 },
  { id: "planchado", name: "Planchado (prenda)", unit: 900 },
  { id: "edredon", name: "Edredón", unit: 7500 },
];

const flow: Status[] = ["recibido", "lavado", "secado", "listo", "entregado"];
const statusLabel: Record<Status, string> = {
  recibido: "Recibido",
  lavado: "En lavado",
  secado: "En secado",
  listo: "Listo para retiro",
  entregado: "Entregado",
};
const statusTone: Record<Status, string> = {
  recibido: "border-line-strong text-ink-soft",
  lavado: "border-cyan/40 text-cyan-soft",
  secado: "border-violet/40 text-violet-soft",
  listo: "border-emerald/40 text-emerald-soft",
  entregado: "border-line text-muted",
};

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const total = (order: Order) => order.lines.reduce((sum, line) => sum + line.qty * line.unit, 0);

const seed: Order[] = [
  { id: 1041, customer: "Cliente Demo A", lines: [{ service: "Lavado por kilo", qty: 5, unit: 1800 }], status: "listo", paid: "tarjeta", createdAt: "09:10" },
  {
    id: 1042,
    customer: "Cliente Demo B",
    lines: [
      { service: "Lavado por kilo", qty: 3, unit: 1800 },
      { service: "Planchado (prenda)", qty: 4, unit: 900 },
    ],
    status: "lavado",
    createdAt: "09:45",
  },
  { id: 1043, customer: "Cliente Demo C", lines: [{ service: "Edredón", qty: 1, unit: 7500 }], status: "recibido", createdAt: "10:20" },
];

function can(role: Role, action: "create" | "advance" | "pay" | "deliver" | "dashboard") {
  if (role === "admin") return true;
  if (role === "recepcion") return action === "create" || action === "pay" || action === "deliver";
  return action === "advance";
}

export default function FastLaundryDemo() {
  const [role, setRole] = useState<Role>("recepcion");
  const [orders, setOrders] = useState<Order[]>(seed);
  const [customer, setCustomer] = useState("");
  const [qty, setQty] = useState<Record<string, number>>({ "lavado-kg": 4 });
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [nextId, setNextId] = useState(1044);

  const draftLines = services.filter((service) => (qty[service.id] ?? 0) > 0).map((service) => ({ service: service.name, qty: qty[service.id], unit: service.unit }));
  const draftTotal = draftLines.reduce((sum, line) => sum + line.qty * line.unit, 0);

  const notify = (tone: "ok" | "error", text: string) => setMessage({ tone, text });

  const createOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!can(role, "create")) return notify("error", "Tu rol no puede crear pedidos.");
    const name = customer.trim();
    if (name.length < 2) return notify("error", "Escribe un nombre de cliente (ficticio) de al menos 2 caracteres.");
    if (draftLines.length === 0) return notify("error", "Agrega al menos un servicio con cantidad mayor a cero.");
    const now = new Date();
    const order: Order = { id: nextId, customer: name.slice(0, 40), lines: draftLines, status: "recibido", createdAt: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}` };
    setOrders((current) => [order, ...current]);
    setNextId((id) => id + 1);
    setCustomer("");
    setQty({ "lavado-kg": 4 });
    notify("ok", `Pedido #${order.id} creado por ${clp.format(total(order))}.`);
  };

  const update = (id: number, change: (order: Order) => Order) => setOrders((current) => current.map((order) => (order.id === id ? change(order) : order)));

  const advance = (order: Order) => {
    if (!can(role, "advance")) return notify("error", "Solo Operario o Administración avanzan el proceso.");
    const next = flow[flow.indexOf(order.status) + 1];
    if (!next || next === "entregado") return;
    update(order.id, (o) => ({ ...o, status: next }));
    notify("ok", `Pedido #${order.id}: ${statusLabel[next]}.`);
  };

  const pay = (order: Order, method: Method) => {
    if (!can(role, "pay")) return notify("error", "Tu rol no tiene acceso a caja.");
    update(order.id, (o) => ({ ...o, paid: method }));
    notify("ok", `Pago simulado de ${clp.format(total(order))} (${method}) en el pedido #${order.id}.`);
  };

  const deliver = (order: Order) => {
    if (!can(role, "deliver")) return notify("error", "Tu rol no entrega pedidos.");
    if (order.status !== "listo") return notify("error", `El pedido #${order.id} aún no está listo.`);
    if (!order.paid) return notify("error", `El pedido #${order.id} tiene saldo pendiente: cóbralo antes de entregar.`);
    update(order.id, (o) => ({ ...o, status: "entregado" }));
    notify("ok", `Pedido #${order.id} entregado.`);
  };

  const reset = () => {
    setOrders(seed);
    setNextId(1044);
    setMessage(null);
  };

  const stats = useMemo(() => {
    const byStatus = flow.map((status) => ({ status, count: orders.filter((order) => order.status === status).length }));
    const byMethod = (["efectivo", "tarjeta", "transferencia"] as Method[]).map((method) => ({
      method,
      amount: orders.filter((order) => order.paid === method).reduce((sum, order) => sum + total(order), 0),
    }));
    const pending = orders.filter((order) => !order.paid).reduce((sum, order) => sum + total(order), 0);
    return { byStatus, byMethod, collected: byMethod.reduce((sum, item) => sum + item.amount, 0), pending };
  }, [orders]);

  return (
    <div className="space-y-6">
      <p role="note" className="rounded-xl border border-amber-300/50 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100" data-testid="fastlaundry-notice">
        Demostración conceptual con datos simulados. No conectada al sistema empresarial real.
      </p>

      <div className="panel flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="font-display text-lg font-semibold text-ink">
            LavaFlow <span className="font-mono text-xs font-normal text-muted">· marca ficticia</span>
          </p>
          <p className="text-xs text-muted">
            {roles[role].label} puede: {roles[role].can.join(", ")}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Rol activo" className="inline-flex rounded-lg border border-line p-0.5">
            {(Object.keys(roles) as Role[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={role === key}
                onClick={() => {
                  setRole(key);
                  setMessage(null);
                }}
                className="rounded-md px-3 py-1.5 text-xs text-ink-soft aria-pressed:bg-white/10 aria-pressed:text-ink"
              >
                {roles[key].label}
              </button>
            ))}
          </div>
          <button type="button" onClick={reset} className="btn btn-ghost h-9 px-3 text-xs">
            <RotateCcw size={14} aria-hidden="true" />
            Reiniciar
          </button>
        </div>
      </div>

      <div aria-live="polite" className="min-h-6">
        {message ? (
          <p
            data-testid="fastlaundry-message"
            className={`flex items-center gap-2 text-sm ${message.tone === "ok" ? "text-emerald-soft" : "text-amber-200"}`}
          >
            {message.tone === "error" ? <Ban size={15} aria-hidden="true" /> : null}
            {message.text}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <form onSubmit={createOrder} className="panel space-y-4 rounded-2xl p-5 lg:col-span-4" aria-labelledby="new-order-title">
          <h2 id="new-order-title" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <PackagePlus size={18} className="text-cyan-soft" aria-hidden="true" />
            Nuevo pedido
          </h2>
          {!can(role, "create") ? (
            <p className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm text-muted">
              <Lock size={14} aria-hidden="true" />
              El rol {roles[role].label} no crea pedidos.
            </p>
          ) : null}
          <fieldset disabled={!can(role, "create")} className="space-y-4 disabled:opacity-50">
            <div>
              <label htmlFor="fl-customer" className="text-xs text-muted">
                Cliente (ficticio)
              </label>
              <input
                id="fl-customer"
                value={customer}
                onChange={(event) => setCustomer(event.target.value)}
                maxLength={40}
                placeholder="Ej.: Cliente Demo D"
                className="mt-1.5 w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-cyan/60 focus:outline-none"
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-xs text-muted">Servicios</legend>
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2">
                  <label htmlFor={`fl-${service.id}`} className="min-w-0 text-sm text-ink-soft">
                    {service.name}
                    <span className="block font-mono text-[0.7rem] text-muted">{clp.format(service.unit)}</span>
                  </label>
                  <input
                    id={`fl-${service.id}`}
                    type="number"
                    min={0}
                    max={50}
                    value={qty[service.id] ?? 0}
                    onChange={(event) => setQty((current) => ({ ...current, [service.id]: Math.min(50, Math.max(0, Math.floor(Number(event.target.value) || 0))) }))}
                    className="w-16 rounded-md border border-line-strong bg-bg px-2 py-1 text-right font-mono text-sm text-ink focus:border-cyan/60 focus:outline-none"
                  />
                </div>
              ))}
            </fieldset>
            <p className="flex items-center justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">Total</span>
              <span className="font-mono text-ink">{clp.format(draftTotal)}</span>
            </p>
            <button type="submit" className="btn btn-primary w-full">
              Crear pedido
            </button>
          </fieldset>
        </form>

        <section aria-labelledby="orders-title" className="min-w-0 space-y-3 lg:col-span-8">
          <h2 id="orders-title" className="font-display text-lg font-semibold text-ink">
            Pedidos ({orders.length})
          </h2>
          <ul className="space-y-3" data-testid="fastlaundry-orders">
            {orders.map((order) => {
              const next = flow[flow.indexOf(order.status) + 1];
              return (
                <li key={order.id} className="panel rounded-xl p-4" data-testid={`order-${order.id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        #{order.id} · <span className="[overflow-wrap:anywhere]">{order.customer}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {order.lines.map((line) => `${line.qty}× ${line.service}`).join(" · ")} · {order.createdAt}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] ${statusTone[order.status]}`} data-testid="order-status">
                        {statusLabel[order.status]}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] ${order.paid ? "border-emerald/40 text-emerald-soft" : "border-amber-300/40 text-amber-200"}`}>
                        {order.paid ? `Pagado · ${order.paid}` : `Pendiente ${clp.format(total(order))}`}
                      </span>
                    </div>
                  </div>
                  {order.status !== "entregado" ? (
                    <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                      {next && next !== "entregado" ? (
                        <button type="button" onClick={() => advance(order)} className="btn btn-ghost h-9 px-3 text-xs">
                          Pasar a «{statusLabel[next]}»
                          <ChevronRight size={14} aria-hidden="true" />
                        </button>
                      ) : null}
                      {!order.paid
                        ? (["efectivo", "tarjeta", "transferencia"] as Method[]).map((method) => (
                            <button key={method} type="button" onClick={() => pay(order, method)} className="btn btn-ghost h-9 px-3 text-xs">
                              <CircleDollarSign size={14} aria-hidden="true" />
                              Cobrar {method}
                            </button>
                          ))
                        : null}
                      {order.status === "listo" ? (
                        <button type="button" onClick={() => deliver(order)} className="btn btn-primary h-9 px-3 text-xs">
                          Entregar
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section aria-labelledby="dashboard-title" className="panel rounded-2xl p-5 sm:p-6">
        <h2 id="dashboard-title" className="font-display text-lg font-semibold text-ink">
          Panel y cierre de caja
        </h2>
        {can(role, "dashboard") ? (
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Pedidos por estado</p>
              <ul className="mt-3 space-y-2">
                {stats.byStatus.map((item) => (
                  <li key={item.status} className="grid grid-cols-[8rem_1fr_2rem] items-center gap-3 text-xs">
                    <span className="text-ink-soft">{statusLabel[item.status]}</span>
                    <span className="relative h-2.5 rounded-full bg-white/[0.04]">
                      <span className="absolute inset-y-0 left-0 rounded-full bg-cyan/80" style={{ width: `${(item.count / Math.max(1, orders.length)) * 100}%` }} />
                    </span>
                    <span className="text-right font-mono text-ink">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xl border border-line bg-line text-sm">
              {stats.byMethod.map((item) => (
                <div key={item.method} className="bg-bg-raised p-3">
                  <dt className="text-xs capitalize text-muted">{item.method}</dt>
                  <dd className="mt-1 font-mono text-ink">{clp.format(item.amount)}</dd>
                </div>
              ))}
              <div className="bg-bg-raised p-3">
                <dt className="text-xs text-muted">Por cobrar</dt>
                <dd className="mt-1 font-mono text-amber-200">{clp.format(stats.pending)}</dd>
              </div>
              <div className="col-span-2 bg-bg-raised p-3">
                <dt className="text-xs text-muted">Recaudado (simulado)</dt>
                <dd className="mt-1 font-display text-2xl text-ink" data-testid="fastlaundry-collected">
                  {clp.format(stats.collected)}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Lock size={14} aria-hidden="true" />
            Solo Administración ve el panel y el cierre de caja. Cambia de rol para verlo.
          </p>
        )}
      </section>
    </div>
  );
}
