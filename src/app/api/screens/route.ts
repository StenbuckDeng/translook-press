import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "@/lib/db";
import { screens } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { redis, CACHE_KEYS } from "@/lib/redis";

const app = new Hono().basePath("/api/screens");

const screenSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  playlistId: z.string().optional(),
});

app.get("/", async (c) => {
  const cached = await redis.get(CACHE_KEYS.screens);
  if (cached) return c.json(cached);

  const all = await db.select().from(screens).orderBy(screens.createdAt);
  await redis.set(CACHE_KEYS.screens, all, { ex: 60 });
  return c.json(all);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const data = screenSchema.parse(body);
  const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const [screen] = await db.insert(screens).values({ ...data, pairingCode }).returning();
  await redis.del(CACHE_KEYS.screens);
  return c.json(screen, 201);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const cached = await redis.get(CACHE_KEYS.screen(id));
  if (cached) return c.json(cached);

  const [screen] = await db.select().from(screens).where(eq(screens.id, id)).limit(1);
  if (!screen) return c.json({ error: "Not found" }, 404);

  await redis.set(CACHE_KEYS.screen(id), screen, { ex: 60 });
  return c.json(screen);
});

app.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const [screen] = await db.update(screens).set({ ...body, updatedAt: new Date() })
    .where(eq(screens.id, id)).returning();
  await redis.del(CACHE_KEYS.screens);
  await redis.del(CACHE_KEYS.screen(id));
  return c.json(screen);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(screens).where(eq(screens.id, id));
  await redis.del(CACHE_KEYS.screens);
  await redis.del(CACHE_KEYS.screen(id));
  return c.json({ ok: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
