import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { screens, playlists, media } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
  const [screen] = await db.select().from(screens).where(eq(screens.pairingCode, code)).limit(1);
  if (!screen) return NextResponse.json({ error: "Screen not found" }, { status: 404 });
  if (screen.status !== "published") return NextResponse.json({ error: "Screen not published" }, { status: 403 });
  await db.update(screens).set({ lastSeen: new Date() }).where(eq(screens.id, screen.id));
  let playlist = null;
  let mediaItems: any[] = [];
  if (screen.playlistId) {
    const [pl] = await db.select().from(playlists).where(eq(playlists.id, screen.playlistId)).limit(1);
    playlist = pl;
    if (pl?.items) {
      const items = pl.items as any[];
      const allMedia = await db.select().from(media);
      mediaItems = items
        .sort((a: any, b: any) => a.order - b.order)
        .map((item: any) => {
          const m = allMedia.find(m => m.id === item.mediaId);
          return m ? { ...m, duration: item.duration || 10 } : null;
        })
        .filter(Boolean);
    }
  }
  return NextResponse.json({ screen, playlist, media: mediaItems });
}
