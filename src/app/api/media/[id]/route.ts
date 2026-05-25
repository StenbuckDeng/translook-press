import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { deleteObject } from "@/lib/r2";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [file] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteObject(file.key);
  await db.delete(media).where(eq(media.id, id));
  return NextResponse.json({ ok: true });
}
