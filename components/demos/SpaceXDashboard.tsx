"use client";

import { useState } from "react";
import { launchSites, models, orbits, spacexSummary } from "@/data/spacex";

const pct = (value: number) => `${Math.round(value * 100)} %`;
const dec = (value: number) => value.toFixed(2).replace(".", ",");
const nf = new Intl.NumberFormat("es-CL");

function Kpi({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="bg-bg-raised p-4 sm:p-5">
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{value}</dd>
      {detail ? <dd className="mt-1 text-xs text-muted">{detail}</dd> : null}
    </div>
  );
}

function Card({ id, title, subtitle, children }: { id: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="panel min-w-0 rounded-2xl p-5 sm:p-6">
      <h2 id={id} className="font-display text-lg font-semibold text-ink">
        {title}
      </h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Barra horizontal de una sola serie con etiqueta directa del valor. */
function Bar({ label, value, max, text, hint }: { label: string; value: number; max: number; text: string; hint: string }) {
  return (
    <li className="group grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[7.5rem_1fr_auto]" title={hint}>
      <span className="truncate font-mono text-xs text-ink-soft">{label}</span>
      <span className="relative h-3 rounded-full bg-white/[0.04]">
        <span className="absolute inset-y-0 left-0 rounded-full bg-cyan/80 transition-colors group-hover:bg-cyan" style={{ width: `${Math.max(2, (value / max) * 100)}%` }} />
      </span>
      <span className="font-mono text-xs text-ink">{text}</span>
    </li>
  );
}

function SitesMap() {
  // Proyección equirectangular simple sobre el rango de longitudes/latitudes de los tres sitios.
  const w = 560;
  const h = 220;
  const lon = (value: number) => ((value + 126) / (126 - 74)) * w;
  const lat = (value: number) => h - ((value - 24) / (38 - 24)) * h;
  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-labelledby="sites-map-title">
        <title id="sites-map-title">Ubicación de los tres sitios de lanzamiento: Vandenberg en la costa oeste y dos sitios en Cabo Cañaveral, en la costa este.</title>
        {[26, 30, 34].map((value) => (
          <g key={value}>
            <line x1={0} x2={w} y1={lat(value)} y2={lat(value)} stroke="var(--line)" />
            <text x={4} y={lat(value) - 4} className="fill-[var(--muted)] font-mono text-[10px]">
              {value}° N
            </text>
          </g>
        ))}
        {[-120, -100, -80].map((value) => (
          <g key={value}>
            <line y1={0} y2={h} x1={lon(value)} x2={lon(value)} stroke="var(--line)" />
            <text x={lon(value) + 4} y={h - 6} className="fill-[var(--muted)] font-mono text-[10px]">
              {Math.abs(value)}° O
            </text>
          </g>
        ))}
        {launchSites.map((site, i) => {
          const r = 5 + Math.sqrt(site.launches) * 1.6;
          const x = lon(site.lon);
          const y = lat(site.lat);
          const labelLeft = site.lon > -100;
          return (
            <g key={site.name}>
              <circle cx={x} cy={y} r={r} fill="rgba(34,211,238,0.35)" stroke="var(--bg)" strokeWidth={2} />
              <circle cx={x} cy={y} r={2.5} fill="var(--cyan-soft)" />
              <text
                x={labelLeft ? x - r - 6 : x + r + 6}
                y={y + (i === 1 ? -14 : i === 0 ? 16 : 4)}
                textAnchor={labelLeft ? "end" : "start"}
                className="fill-[var(--text)] font-mono text-[11px]"
              >
                {site.name} · {site.launches}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-muted">Área del círculo proporcional a los lanzamientos. Sin mapa base: solo coordenadas del dataset.</figcaption>
    </figure>
  );
}

export default function SpaceXDashboard() {
  const [modelId, setModelId] = useState(models[0].id);
  const [orbitSort, setOrbitSort] = useState<"launches" | "rate">("launches");
  const model = models.find((item) => item.id === modelId) ?? models[0];
  const sortedOrbits = [...orbits].sort((a, b) =>
    orbitSort === "launches" ? b.launches - a.launches : b.successes / b.launches - a.successes / a.launches || b.launches - a.launches,
  );
  const maxSite = Math.max(...launchSites.map((site) => site.launches));
  const [[tn, fp], [fn, tp]] = model.confusion;
  const cells = [
    { label: "Fallo predicho fallo", value: tn, ok: true },
    { label: "Fallo predicho éxito", value: fp, ok: false },
    { label: "Éxito predicho fallo", value: fn, ok: false },
    { label: "Éxito predicho éxito", value: tp, ok: true },
  ];
  const maxCell = Math.max(...model.confusion.flat());

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        <Kpi label="Lanzamientos" value={String(spacexSummary.launches)} detail="Falcon 9, 2010–2020" />
        <Kpi
          label="Aterrizajes exitosos"
          value={String(spacexSummary.successfulLandings)}
          detail={`${pct(spacexSummary.successfulLandings / spacexSummary.launches)} del total`}
        />
        <Kpi label="Carga útil total" value={`${nf.format(Math.round(spacexSummary.totalPayloadKg))} kg`} />
        <Kpi label="Lanzamientos de prueba" value={String(spacexSummary.testSize)} detail="20 % del dataset" />
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card id="sites-title" title="Lanzamientos por sitio" subtitle="SELECT LaunchSite, COUNT(*) … GROUP BY LaunchSite">
          <ul className="space-y-3">
            {launchSites.map((site) => (
              <Bar key={site.name} label={site.name} value={site.launches} max={maxSite} text={String(site.launches)} hint={`${site.place}: ${site.launches} lanzamientos`} />
            ))}
          </ul>
          <div className="mt-6">
            <SitesMap />
          </div>
        </Card>

        <Card id="orbits-title" title="Tasa de aterrizaje por órbita" subtitle="Éxitos / lanzamientos por tipo de órbita">
          <div role="group" aria-label="Ordenar órbitas" className="mb-4 inline-flex rounded-lg border border-line p-0.5">
            {(
              [
                ["launches", "Por lanzamientos"],
                ["rate", "Por tasa"],
              ] as const
            ).map(([value, text]) => (
              <button
                key={value}
                type="button"
                aria-pressed={orbitSort === value}
                onClick={() => setOrbitSort(value)}
                className="rounded-md px-3 py-1.5 text-xs text-ink-soft aria-pressed:bg-white/10 aria-pressed:text-ink"
              >
                {text}
              </button>
            ))}
          </div>
          <ul className="space-y-2.5" aria-label="Tasa de éxito por órbita">
            {sortedOrbits.map((orbit) => (
              <Bar
                key={orbit.orbit}
                label={orbit.orbit}
                value={orbit.successes / orbit.launches}
                max={1}
                text={`${pct(orbit.successes / orbit.launches)} · n=${orbit.launches}`}
                hint={`${orbit.orbit}: ${orbit.successes} de ${orbit.launches}`}
              />
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">Cuatro órbitas tienen un solo lanzamiento: su 0 % o 100 % no es una tendencia.</p>
        </Card>
      </div>

      <Card id="models-title" title="Comparación de clasificadores" subtitle="Mismo split (random_state=2): 6 aterrizajes fallidos y 12 exitosos en prueba">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <fieldset>
              <legend className="sr-only">Modelo</legend>
              <ul className="space-y-2">
                {models.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-line p-3 has-[:checked]:border-cyan/50 has-[:checked]:bg-cyan/5">
                      <input type="radio" name="spacex-model" value={item.id} checked={modelId === item.id} onChange={() => setModelId(item.id)} className="accent-cyan-400" />
                      <span className="w-36 shrink-0 text-sm text-ink">{item.name}</span>
                      <span className="relative h-2.5 flex-1 rounded-full bg-white/[0.04]">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-cyan/80" style={{ width: `${item.accuracy * 100}%` }} />
                      </span>
                      <span className="w-10 text-right font-mono text-xs text-ink">{dec(item.accuracy)}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <p className="mt-3 text-xs text-muted">Exactitud en el conjunto de prueba (18 lanzamientos).</p>
          </div>

          <div aria-live="polite">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Matriz de confusión · {model.name}</p>
            <div className="mt-3 grid max-w-sm grid-cols-[auto_1fr_1fr] gap-1.5 text-center" data-testid="spacex-confusion">
              <span />
              <span className="font-mono text-[0.65rem] text-muted">Predicho fallo</span>
              <span className="font-mono text-[0.65rem] text-muted">Predicho éxito</span>
              {[0, 1].map((row) => (
                <div key={row} className="contents">
                  <span className="self-center pr-2 text-right font-mono text-[0.65rem] text-muted">{row === 0 ? "Real fallo" : "Real éxito"}</span>
                  {cells.slice(row * 2, row * 2 + 2).map((cell) => (
                    <span
                      key={cell.label}
                      aria-label={`${cell.label}: ${cell.value}`}
                      className={`grid aspect-[4/3] place-items-center rounded-lg border font-display text-2xl ${cell.ok ? "border-cyan/30 text-ink" : "border-line text-ink-soft"}`}
                      style={{ backgroundColor: `rgba(34, 211, 238, ${0.06 + (cell.value / maxCell) * 0.38})` }}
                    >
                      {cell.value}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <table className="mt-5 w-full max-w-sm text-left text-xs">
              <caption className="sr-only">Métricas por clase de {model.name}</caption>
              <thead className="font-mono text-muted">
                <tr>
                  <th scope="col" className="py-1 font-normal">
                    Clase
                  </th>
                  <th scope="col" className="py-1 font-normal">
                    Precisión
                  </th>
                  <th scope="col" className="py-1 font-normal">
                    Recall
                  </th>
                  <th scope="col" className="py-1 font-normal">
                    F1
                  </th>
                </tr>
              </thead>
              <tbody className="font-mono text-ink-soft">
                {(
                  [
                    ["Fallido (0)", model.failed],
                    ["Exitoso (1)", model.landed],
                  ] as const
                ).map(([label, report]) => (
                  <tr key={label} className="border-t border-line">
                    <th scope="row" className="py-1.5 font-normal text-ink">
                      {label}
                    </th>
                    <td>{dec(report.precision)}</td>
                    <td>{dec(report.recall)}</td>
                    <td>{dec(report.f1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Detecta {tn} de {tn + fp} aterrizajes fallidos.
              {model.note ? ` ${model.note}` : ""}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
