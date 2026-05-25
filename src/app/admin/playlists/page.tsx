import { db } from "@/lib/db";
import { playlists, media } from "@/lib/schema";
import PlaylistsClient from "./client";

export default async function PlaylistsPage() {
  const [allPlaylists, allMedia] = await Promise.all([
    db.select().from(playlists).orderBy(playlists.createdAt),
    db.select().from(media),
  ]);
  return <PlaylistsClient playlists={allPlaylists} media={allMedia} />;
}
