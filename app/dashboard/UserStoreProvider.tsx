"use client";
import { useRef } from "react";
import { proxy } from "valtio";

export type User = { id: string; name: string; email: string };
export const userStore = proxy<{ user: User | null }>({ user: null });

export default function UserStoreProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const lastSyncedUser = useRef<User | null>(null);

  // Re-sync whenever the server sends a different user
  // (initial render, and after router.refresh() / revalidatePath)
  if (lastSyncedUser.current !== user) {
    userStore.user = user;
    lastSyncedUser.current = user;
  }

  return <>{children}</>;
}
