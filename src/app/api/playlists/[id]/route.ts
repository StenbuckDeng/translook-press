import { db } from "@/lib/db";
import { playlists } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { redis, CACHE_KEYS } from "@/lib/redis";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [playlist] = await db.update(playlists)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(playlists.id, id))
    .returning();
  await redis.del(CACHE_KEYS.playlists);
  await redis.del(CACHE_KEYS.playlist(id));
  return NextResponse.json(playlist);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(playlists).where(eq(playlists.id, id));
  await redis.del(CACHE_KEYS.playlists);
  return NextResponse.json({ ok: true });
}
