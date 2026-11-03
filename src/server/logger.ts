import "server-only";

// Small structured logger: one JSON line per event, readable in Vercel logs.
// Errors are reduced to name and message so secrets in stack traces or request bodies are not logged.

type Level = "info" | "warn" | "error";

function write(level: Level, msg: string, extra?: unknown) {
  const detail = extra instanceof Error ? { error: extra.name, message: extra.message } : extra;
  const line = JSON.stringify({ level, msg, ...(detail && typeof detail === "object" ? detail : detail !== undefined ? { detail } : {}), at: new Date().toISOString() });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (msg: string, extra?: unknown) => write("info", msg, extra),
  warn: (msg: string, extra?: unknown) => write("warn", msg, extra),
  error: (msg: string, extra?: unknown) => write("error", msg, extra),
};
