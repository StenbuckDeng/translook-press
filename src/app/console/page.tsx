import { db } from "@/lib/db";
import { screens, media, playlists } from "@/lib/schema";
import { desc } from "drizzle-orm";
import ConsoleClient from "./client";

export const dynamic = "force-dynamic";

export default async function ConsolePage() {
  const [allScreens, allMedia, allPlaylists] = await Promise.all([
    db.select().from(screens).orderBy(desc(screens.updatedAt)),
    db.select().from(media).orderBy(desc(media.createdAt)).limit(8),
    db.select().from(playlists).orderBy(desc(playlists.updatedAt)),
  ]);

  return <ConsoleClient screens={allScreens} media={allMedia} playlists={allPlaylists} />;
}
