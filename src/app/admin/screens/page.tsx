import { db } from "@/lib/db";
import { screens, playlists } from "@/lib/schema";
import ScreensClient from "./client";

export default async function ScreensPage() {
  const [allScreens, allPlaylists] = await Promise.all([
    db.select().from(screens).orderBy(screens.createdAt),
    db.select().from(playlists),
  ]);
  return <ScreensClient screens={allScreens} playlists={allPlaylists} />;
}
