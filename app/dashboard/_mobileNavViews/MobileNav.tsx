"use client";
import HamburgerIcon from "@/app/_components/Hamburger";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

import MobileItemsSidebar from "./MobileNavItems";

import { isShownStore } from "./navStore";

export function MobileNav() {
  const isShownSnap = useSnapshot(isShownStore);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        isShownStore.isShown = false;
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="lg:hidden">
      <HamburgerIcon
        toggleShow={() => {
          isShownStore.isShown = true;
        }}
      ></HamburgerIcon>
      <MobileItemsSidebar isShown={isShownSnap.isShown}></MobileItemsSidebar>
    </div>
  );
}
