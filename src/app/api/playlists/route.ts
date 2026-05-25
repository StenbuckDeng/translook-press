import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "@/lib/db";
import { playlists } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { redis, CACHE_KEYS } from "@/lib/redis";

const app = new Hono().basePath("/api/playlists");

const playlistSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  items: z.array(z.object({
    mediaId: z.string(),
    duration: z.number().default(10),
    order: z.number(),
    transition: z.string().optional(),
  })).default([]),
});

app.get("/", async (c) => {
  const cached = await redis.get(CACHE_KEYS.playlists);
  if (cached) return c.json(cached);
  const all = await db.select().from(playlists).orderBy(playlists.createdAt);
  await redis.set(CACHE_KEYS.playlists, all, { ex: 60 });
  return c.json(all);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const data = playlistSchema.parse(body);
  const [playlist] = await db.insert(playlists).values(data).returning();
  await redis.del(CACHE_KEYS.playlists);
  return c.json(playlist, 201);
});

app.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const [playlist] = await db.update(playlists)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(playlists.id, id))
    .returning();
  await redis.del(CACHE_KEYS.playlists);
  await redis.del(CACHE_KEYS.playlist(id));
  return c.json(playlist);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(playlists).where(eq(playlists.id, id));
  await redis.del(CACHE_KEYS.playlists);
  return c.json({ ok: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
