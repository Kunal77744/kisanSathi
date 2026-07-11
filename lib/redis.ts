import { Redis } from "@upstash/redis";

// Check both naming conventions Vercel might inject and support whichever exists.
// Vercel KV uses KV_REST_API_URL/TOKEN, while standard Upstash uses UPSTASH_REDIS_REST_URL/TOKEN.
if (!process.env.UPSTASH_REDIS_REST_URL && process.env.KV_REST_API_URL) {
  process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
}
if (!process.env.UPSTASH_REDIS_REST_TOKEN && process.env.KV_REST_API_TOKEN) {
  process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
}

// Instantiate client if variables are present, else export null to fall back gracefully.
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? Redis.fromEnv()
  : null;
