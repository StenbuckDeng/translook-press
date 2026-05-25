import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getPresignedUploadUrl, generateKey, deleteObject, getPublicUrl } from "@/lib/r2";
import { z } from "zod";

const app = new Hono().basePath("/api/media");

app.get("/", async (c) => {
  const all = await db.select().from(media).orderBy(media.createdAt);
  return c.json(all);
});

app.post("/presign", async (c) => {
  const { filename, contentType } = await c.req.json();
  const key = generateKey(filename);
  const uploadUrl = await getPresignedUploadUrl(key, contentType);
  return c.json({ uploadUrl, key });
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const schema = z.object({
    name: z.string(),
    key: z.string(),
    size: z.number(),
    mimeType: z.string(),
    type: z.enum(["image", "video", "document", "audio"]),
  });
  const data = schema.parse(body);
  const url = getPublicUrl(data.key);

  const [file] = await db.insert(media).values({ ...data, url }).returning();
  return c.json(file, 201);
});

app.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [file] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!file) return c.json({ error: "Not found" }, 404);

  await deleteObject(file.key);
  await db.delete(media).where(eq(media.id, id));
  return c.json({ ok: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
