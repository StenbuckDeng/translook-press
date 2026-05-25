import { AwsClient } from "aws4fetch";

const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_BUCKET = process.env.R2_BUCKET_NAME!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;

const r2 = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
  service: "s3",
  region: "auto",
});

export async function getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
  const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`);
  url.searchParams.set("X-Amz-Expires", "3600");

  const signed = await r2.sign(
    new Request(url.toString(), { method: "PUT" }),
    { aws: { signQuery: true } }
  );

  return signed.url;
}

export async function deleteObject(key: string): Promise<void> {
  const url = `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
  await r2.fetch(url, { method: "DELETE" });
}

export function getPublicUrl(key: string): string {
  return `${R2_ENDPOINT}/${R2_BUCKET}/${key}`;
}

export function generateKey(filename: string, folder = "uploads"): string {
  const ext = filename.split(".").pop();
  const name = crypto.randomUUID();
  return `${folder}/${name}.${ext}`;
}
