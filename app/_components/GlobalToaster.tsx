"use client";
import { useSnapshot } from "valtio";
import { toastStore } from "@/app/dashboard/ValtioStores/toastStore";
import Toaster from "./Toaster";

export default function GlobalToaster() {
  const snap = useSnapshot(toastStore);

  return <Toaster isShown={snap.isShown}>{snap.content?.node}</Toaster>;
}
