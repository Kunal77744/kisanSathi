export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "https://ekisansaathi.vercel.app";

export const SUPPORT_EMAIL = "help@ekisansaathi.vercel.app";

export function getObfuscatedEmailHtml(): string {
  return SUPPORT_EMAIL
    .split("")
    .map((c) => `&#${c.charCodeAt(0)};`)
    .join("");
}
