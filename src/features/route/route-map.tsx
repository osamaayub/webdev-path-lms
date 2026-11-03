"use client";

import Link from "next/link";
import { colorFor } from "@/config/theme";
import { useProgress } from "@/features/progress/store";

export type RouteStop = { id: string; week: number; title: string; href: string };
export type RouteLine = { slug: string; number: number; title: string; stops: RouteStop[] };

const W = 560, X0 = 62, X1 = 498, ROW = 92, Y0 = 64, R = ROW / 2;

/**
 * The course drawn as a transit line that snakes left and right, one row per phase.
 * Each week is a stop; stops you have finished fill in with the phase colour.
 */
export function RouteMap({ lines, animate = false }: { lines: RouteLine[]; animate?: boolean }) {
  const done = new Set(useProgress().completed);
  const H = Y0 + (lines.length - 1) * ROW + 56;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Course route: 6 phases, 24 weekly stops">
      {lines.map((line, i) => {
        const y = Y0 + i * ROW;
        const ltr = i % 2 === 0;
        const c = colorFor(line.slug);
        const xs = line.stops.map((_, k) => {
          const t = line.stops.length === 1 ? 0.5 : k / (line.stops.length - 1);
          const x = X0 + 28 + t * (X1 - X0 - 56);
          return ltr ? x : W - x;
        });
        // The row, plus the bend that carries the line down to the next row.
        const start = ltr ? X0 : X1;
        const end = ltr ? X1 : X0;
        const bend = i < lines.length - 1 ? (ltr ? ` A ${R} ${R} 0 0 1 ${end} ${y + ROW}` : ` A ${R} ${R} 0 0 0 ${end} ${y + ROW}`) : "";
        return (
          <g key={line.slug}>
            <path
              d={`M ${start} ${y} L ${end} ${y}${bend}`}
              fill="none"
              stroke={c.line}
              strokeWidth="7"
              strokeLinecap="round"
              pathLength={1}
              className={animate ? "route-draw" : undefined}
              style={animate ? ({ "--len": 1, animationDelay: `${i * 0.18}s` } as React.CSSProperties) : undefined}
            />
            <text x={ltr ? X0 : X1} y={y - 18} textAnchor={ltr ? "start" : "end"} className="fill-ink font-display" fontSize="15" fontWeight="700">
              {line.number}. {line.title}
            </text>
            {line.stops.map((s, k) => {
              const isDone = done.has(s.id);
              return (
                <Link key={s.id} href={s.href} aria-label={`Week ${s.week}: ${s.title}${isDone ? " (done)" : ""}`}>
                  <title>{`Week ${s.week}: ${s.title}`}</title>
                  <circle cx={xs[k]} cy={y} r="13" fill={isDone ? c.line : "#fff"} stroke="#14213D" strokeWidth="2.5" />
                  <text x={xs[k]} y={y + 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={isDone ? "#fff" : "#14213D"}>
                    {s.week}
                  </text>
                </Link>
              );
            })}
          </g>
        );
      })}
      <text x={lines.length % 2 === 0 ? X0 : X1} y={H - 14} textAnchor={lines.length % 2 === 0 ? "start" : "end"} fontSize="13" className="fill-muted">
        Week 24: job ready
      </text>
    </svg>
  );
}
