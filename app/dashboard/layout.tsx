import AppLogo from "@/app/_components/AppLogo";
import { MobileNav } from "./_mobileNavViews/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <header className="bg-linear-to-b from-blue-800 to-blue-600 h-[150px] lg:h-[200px]">
        <div className="w-full max-w-[1400px] p-6 mx-auto flex flex-col">
          <div className="flex items-center justify-between">
            <AppLogo
              width={140}
              height={30}
              className="hidden lg:block"
            ></AppLogo>
            <MobileNav></MobileNav>

            <p className="">Hi</p>
          </div>

          <div className=""></div>
        </div>
      </header>
      {children}
    </main>
  );
}
