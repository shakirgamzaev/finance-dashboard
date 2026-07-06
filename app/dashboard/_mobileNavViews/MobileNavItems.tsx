"use client";

import CrossMark from "@/app/_components/CrossMark";
import { NAV_ROUTES } from "@/app/_config/routes";
import { isShownStore } from "./navStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function MobileNavItems({ isShown }: { isShown: boolean }) {
  const pathName = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathName is intentionally a trigger to close the nav on route change, not a value read inside the effect
  useEffect(() => {
    isShownStore.isShown = false;
  }, [pathName]);

  function hideSideBar() {
    isShownStore.isShown = false;
  }

  return (
    <div>
      <button
        type="button"
        aria-label="Close menu"
        onClick={hideSideBar}
        className={`fixed w-full h-full bg-black z-40 left-0 top-0 transition-opacity duration-300 ease-in-out ${
          isShown ? `opacity-30` : `opacity-0 pointer-events-none`
        }`}
      ></button>
      <div
        aria-hidden={!isShown}
        className={`fixed top-0 left-0 z-50 flex flex-col px-1 bg-white h-full w-full max-w-[450px] gap-4 transition-transform duration-300 ease-in-out  ${
          isShown ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-2.5">
          <CrossMark size={20} onClick={hideSideBar}></CrossMark>
        </div>

        {NAV_ROUTES.map((route) => {
          return (
            <Link
              href={route.href}
              key={route.label}
              className={` font-bold text-base p-2 text-center rounded-[6px] ${route.href === pathName ? "bg-cyan-200" : ""} cursor-pointer`}
            >
              {route.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
