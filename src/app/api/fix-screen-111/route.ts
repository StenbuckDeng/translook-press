import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { screens, playlists } from "@/lib/schema";
import { eq, like } from "drizzle-orm";
import { redis, CACHE_KEYS } from "@/lib/redis";

export async function GET() {
  const log: string[] = [];

  try {
    // 1. Find and delete screen named "111"
    const existing = await db
      .select()
      .from(screens)
      .where(like(screens.name, "%111%"));

    log.push(`Found ${existing.length} screen(s) matching "111": ${existing.map(s => `${s.name}(${s.id})`).join(", ")}`);

    for (const s of existing) {
      await db.delete(screens).where(eq(screens.id, s.id));
      await redis.del(CACHE_KEYS.screen(s.id));
      log.push(`Deleted screen: ${s.name} (${s.id})`);
    }
    await redis.del(CACHE_KEYS.screens);

    // 2. Find playlist named "lop"
    const allPlaylists = await db.select().from(playlists);
    const lopPlaylist = allPlaylists.find(
      (p) => p.name.toLowerCase() === "lop"
    );

    if (!lopPlaylist) {
      log.push("ERROR: Could not find playlist named 'lop'");
      return NextResponse.json({ ok: false, log }, { status: 404 });
    }
    log.push(`Found playlist "lop": id=${lopPlaylist.id}, items=${JSON.stringify(lopPlaylist.items)}`);

    // 3. Recreate screen "111" linked to lop playlist
    const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [newScreen] = await db
      .insert(screens)
      .values({
        name: "111",
        description: "Recreated and linked to lop playlist",
        playlistId: lopPlaylist.id,
        status: "published",
        pairingCode,
      })
      .returning();

    await redis.del(CACHE_KEYS.screens);
    log.push(`Created new screen "111": id=${newScreen.id}, pairingCode=${pairingCode}, playlistId=${lopPlaylist.id}`);

    return NextResponse.json({ ok: true, newScreen, lopPlaylist, log });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.push(`EXCEPTION: ${message}`);
    return NextResponse.json({ ok: false, error: message, log }, { status: 500 });
  }
}
