import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import MediaClient from "./client";

export default async function MediaPage() {
  const files = await db.select().from(media).orderBy(media.createdAt);
  return <MediaClient files={files} />;
}
