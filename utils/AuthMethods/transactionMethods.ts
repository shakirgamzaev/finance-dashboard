import type {
  CategoryExpense,
  Transaction,
  TransactionPayload,
  TransactionSeriesPoint,
  TransactionSummary,
} from "@/app/models/transaction";
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
  id: string,
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

//start/end are ISO YYYY-MM-DD strings; omitted -> no date filtering
export async function getTransactions(
  start?: string | null,
  end?: string | null,
): Promise<Transaction[]> {
  const token = await getAccessToken();
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  const query = params.size > 0 ? `?${params}` : "";
  const res = await fetch(`${BACKEND_URL}/transactions${query}`, {
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

//formats a Date as an ISO YYYY-MM-DD string for the backend date query params
function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getTransactionSummary(
  start: Date,
  end: Date,
  token?: string,
): Promise<TransactionSummary> {
  const authToken = token ?? (await getAccessToken());
  const params = new URLSearchParams({
    start: toISODate(start),
    end: toISODate(end),
  });
  const res = await fetch(`${BACKEND_URL}/transactions/summary?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching transaction summary failed: ${res.status}`);
  }
  return res.json();
}

export async function getTransactionSeries(
  start: Date,
  end: Date,
  token?: string,
): Promise<TransactionSeriesPoint[]> {
  const authToken = token ?? (await getAccessToken());
  const params = new URLSearchParams({
    start: toISODate(start),
    end: toISODate(end),
  });
  const res = await fetch(`${BACKEND_URL}/transactions/series?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching transaction series failed: ${res.status}`);
  }
  return res.json();
}

export async function getExpensesByCategory(
  start: Date,
  end: Date,
  token?: string,
): Promise<CategoryExpense[]> {
  const authToken = token ?? (await getAccessToken());
  const params = new URLSearchParams({
    start: toISODate(start),
    end: toISODate(end),
  });
  const res = await fetch(`${BACKEND_URL}/transactions/categories?${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching category expenses failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteTransaction(id: string): Promise<void> {
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
  ids: string[],
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
