import { NextRequest, NextResponse } from "next/server";
import { AwsClient } from "aws4fetch";

export async function PUT(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  const r2 = new AwsClient({
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    service: "s3",
    region: "auto",
  });

  const body = await req.arrayBuffer();
  const contentType = req.headers.get("content-type") || "application/octet-stream";
  const url = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;

  const res = await r2.fetch(url, {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType },
  });

  if (!res.ok) return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  return NextResponse.json({ ok: true, key });
}
