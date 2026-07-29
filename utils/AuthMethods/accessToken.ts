import { authClient } from "@/utils/auth-client";

let cached: { token: string; exp: number } | null = null;

function decodeJwtExp(token: string): number {
  // A JWT is "header.payload.signature". The payload is JSON encoded as
  // base64url, which is base64 with '-' instead of '+' and '_' instead of '/'.
  const payloadPart = token.split(".")[1];
  const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
  const payload = JSON.parse(atob(base64));
  // exp is in seconds; convert to milliseconds for Date.now() comparison
  return payload.exp * 1000;
}

export async function getAccessToken() {
  if (cached && cached.exp - 30_000 > Date.now()) return cached.token;

  const { data, error } = await authClient.token();
  if (error || !data) throw new Error("Failed to get access token");

  cached = { token: data.token, exp: decodeJwtExp(data.token) };
  return cached.token;
}
