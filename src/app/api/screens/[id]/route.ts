import { db } from "@/lib/db";
import { screens } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { redis, CACHE_KEYS } from "@/lib/redis";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [screen] = await db.update(screens)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(screens.id, id))
    .returning();
  await redis.del(CACHE_KEYS.screens);
  await redis.del(CACHE_KEYS.screen(id));
  return NextResponse.json(screen);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(screens).where(eq(screens.id, id));
  await redis.del(CACHE_KEYS.screens);
  await redis.del(CACHE_KEYS.screen(id));
  return NextResponse.json({ ok: true });
}
