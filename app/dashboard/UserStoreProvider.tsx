"use client"
import { useRef } from "react";
import { proxy } from "valtio";

export type User = { id: string; name: string; email: string };
export const userStore = proxy<{ user: User | null }>({ user: null });

export default function UserStoreProvider({
  user,
  children,
}: {
  user: User | string;
  children: React.ReactNode;
}) {
  const isHydrated = useRef(false);

  if (!isHydrated.current) {
    if (typeof user === "string") {
      userStore.user = { id: "1", name: user, email: "" };
    } else {
      userStore.user = user;
    }
    isHydrated.current = true;
  }

  return <>{children}</>;
}
