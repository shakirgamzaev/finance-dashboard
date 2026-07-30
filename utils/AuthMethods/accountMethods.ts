import type { Account } from "@/app/models/account";
import { getAccessToken } from "./accessToken";

//url of the fast api server, read from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createAccount(name: string) {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(`Create account failed: ${res.status}`);
  }
  return res.json();
}

export async function getAccounts(): Promise<Account[]> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/accounts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching accounts failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteAccounts(
  ids: number[],
): Promise<{ deleted: number }> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/accounts/deleteAll`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    throw new Error(`Deleting accounts failed: ${res.status}`);
  }
  return res.json();
}
