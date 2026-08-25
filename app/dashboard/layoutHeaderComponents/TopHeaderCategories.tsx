"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_ROUTES } from "@/app/_config/routes";
import Link from "next/link";

export default function TopHeaderCategories() {
  const currentPath = usePathname();
  //carry the date range params across page navigations
  const search = useSearchParams().toString();

  return (
    <div className="gap-4 items-center hidden lg:flex">
      {NAV_ROUTES.map((route) => {
        const isActive = route.href === currentPath;
        return (
          <Link
            href={search ? `${route.href}?${search}` : route.href}
            key={route.href}
            className={`text-white text-[13.5px] p-2 rounded-md ${isActive ? `bg-white/15` : `hover:bg-white/10`}`}
          >
            {route.label}
          </Link>
        );
      })}
    </div>
  );
}
