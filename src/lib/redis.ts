import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function cacheGet<T>(key: string): Promise<T | null> {
  return redis.get<T>(key);
}

export async function cacheSet(key: string, value: unknown, ttl = 300): Promise<void> {
  await redis.set(key, value, { ex: ttl });
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}

export async function publishEvent(channel: string, data: unknown): Promise<void> {
  await redis.publish(channel, JSON.stringify(data));
}

export const CACHE_KEYS = {
  screens: "screens:all",
  screen: (id: string) => `screen:${id}`,
  playlists: "playlists:all",
  playlist: (id: string) => `playlist:${id}`,
  media: "media:all",
  pairingCode: (code: string) => `pairing:${code}`,
};
