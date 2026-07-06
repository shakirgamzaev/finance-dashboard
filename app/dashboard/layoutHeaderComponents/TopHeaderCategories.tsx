"use client";
import { usePathname } from "next/navigation";
import { NAV_ROUTES } from "@/app/_config/routes";
import Link from "next/link";

export default function TopHeaderCategories() {
  const currentPath = usePathname();

  return (
    <div className="gap-4 items-center hidden lg:flex">
      {NAV_ROUTES.map((route) => {
        return <Link href={route.href} key={route.href} className={`text-white text-[13.5px] p-2  rounded-md  ${route.href === currentPath ? `bg-white/15` : ``}`}>{route.label}</Link>;
      })}
    </div>
  );
}
