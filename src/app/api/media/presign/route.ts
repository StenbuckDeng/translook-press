import { NextRequest, NextResponse } from "next/server";
import { generateKey } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { filename, contentType } = await req.json();
  const key = generateKey(filename);
  return NextResponse.json({ key, uploadEndpoint: `/api/media/upload` });
}
