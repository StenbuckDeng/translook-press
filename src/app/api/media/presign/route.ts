import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, generateKey } from "@/lib/r2";

export async function POST(req: NextRequest) {
  const { filename, contentType } = await req.json();
  const key = generateKey(filename);
  const uploadUrl = await getPresignedUploadUrl(key, contentType);
  return NextResponse.json({ uploadUrl, key });
}
