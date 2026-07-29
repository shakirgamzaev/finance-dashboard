"use client";
import type React from "react";
import { proxy, ref } from "valtio";

// The React node is wrapped in ref() so valtio doesn't try to proxy
// the JSX element tree — it's opaque UI content, not reactive state.
// Typing the field via `ref`'s return type also tells useSnapshot's
// Snapshot<T> to leave it as-is instead of deep-readonly-ing ReactNode.
type ToastContent = ReturnType<typeof ref<{ node: React.ReactNode }>>;

export const toastStore = proxy<{
  isShown: boolean;
  content: ToastContent | null;
}>({ isShown: false, content: null });

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export function showToast(node: React.ReactNode, durationMs = 2000) {
  toastStore.content = ref({ node });
  toastStore.isShown = true;
  if (hideTimeout) clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    toastStore.isShown = false;
  }, durationMs);
}
