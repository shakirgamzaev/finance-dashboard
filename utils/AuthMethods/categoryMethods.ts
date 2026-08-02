import type { Category } from "@/app/models/category";
import { getAccessToken } from "./accessToken";

//url of the fast api server, read from environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function createCategory(name: string) {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(`Create category failed: ${res.status}`);
  }
  return res.json();
}

export async function updateCategory(id: number, name: string) {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(`Update category failed: ${res.status}`);
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Fetching categories failed: ${res.status}`);
  }
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Deleting category failed: ${res.status}`);
  }
}

export async function deleteCategories(
  ids: number[],
): Promise<{ deleted: number }> {
  const token = await getAccessToken();
  const res = await fetch(`${BACKEND_URL}/categories/deleteAll`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    throw new Error(`Deleting categories failed: ${res.status}`);
  }
  return res.json();
}
