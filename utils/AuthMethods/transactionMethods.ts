import type { Transaction, TransactionPayload } from "@/app/models/transaction";
import { getAccessToken } from "./accessToken";

//url of the fast api server, read from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createTransaction(payload: TransactionPayload) {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Create transaction failed: ${res.status}`);
  }
  return res.json();
}

export async function updateTransaction(
  id: number,
  payload: TransactionPayload,
) {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/transactions/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Update transaction failed: ${res.status}`);
  }
  return res.json();
}

export async function getTransactions(): Promise<Transaction[]> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/transactions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching transactions failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteTransaction(id: number): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Deleting transaction failed: ${res.status}`);
  }
}

export async function deleteTransactions(
  ids: number[],
): Promise<{ deleted: number }> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/transactions/deleteAll`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    throw new Error(`Deleting transactions failed: ${res.status}`);
  }
  return res.json();
}
