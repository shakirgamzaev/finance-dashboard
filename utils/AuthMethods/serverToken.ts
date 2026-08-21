import "server-only";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

//mints a JWT on the server by reading the session cookie from the incoming request
export async function getServerAccessToken(): Promise<string> {
  const result = await auth.api.getToken({ headers: await headers() });
  if (!result?.token) throw new Error("Failed to get access token");
  return result.token;
}
