import "server-only";
import { logger } from "./logger";
import { AuthError } from "./viewer";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

export const fail = (error: string, fieldErrors?: Record<string, string[] | undefined>): ActionResult<never> => ({ ok: false, error, fieldErrors });

/** Runs an action body and turns thrown errors into safe messages. Internals are logged, never sent to the browser. */
export async function safely<T>(name: string, body: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await body();
  } catch (err) {
    if (err instanceof AuthError) return fail(err.message);
    logger.error(`${name} failed`, err);
    return fail("Something went wrong on our side. Please try again.");
  }
}
