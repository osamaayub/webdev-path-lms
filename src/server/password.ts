import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, type ScryptOptions } from "node:crypto";

// scrypt is built into Node and is a memory-hard password hash (OWASP lists it as acceptable).
// Stored format: scrypt$N$r$p$salt$hash (salt and hash in base64), so parameters can be raised later.
const N = 16384, R = 8, P = 1, KEYLEN = 64;

const scrypt = (pw: string, salt: Buffer, keylen: number, opts: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scryptCb(pw.normalize("NFKC"), salt, keylen, { ...opts, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k))));

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

// A fixed hash to compare against when the email has no password, so a wrong email
// takes as long as a wrong password and response time doesn't reveal which emails exist.
const DUMMY = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" + Buffer.alloc(KEYLEN).toString("base64");

export async function verifyPassword(password: string, stored: string | null | undefined) {
  const [scheme, n, r, p, salt, hash] = (stored ?? DUMMY).split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scrypt(password, Buffer.from(salt, "base64"), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
  return Boolean(stored) && actual.length === expected.length && timingSafeEqual(actual, expected);
}
