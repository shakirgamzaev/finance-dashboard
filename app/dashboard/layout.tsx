import AppLogo from "@/app/_components/AppLogo";
import { MobileNav } from "./_mobileNavViews/MobileNav";
import UserStoreProvider from "./UserStoreProvider";

async function GetUser() {
  //TODO: call my server and get the user data
  return "User";
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await GetUser();

  return (
    <UserStoreProvider user={user}>
      <main>
        <header className="bg-linear-to-b from-blue-800 to-blue-600 h-[200px] lg:h-auto">
          <div className="w-full max-w-[1400px] p-6 mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <AppLogo
                width={140}
                height={30}
                className="hidden lg:block"
              ></AppLogo>
              <MobileNav></MobileNav>

              <p className="">Hi</p>
            </div>

            <div className="flex flex-col items-start grow gap-3">
              <p className="text-white text-2xl lg:text-3xl">Welcome Back, {user}</p>
              <p className="text-faintBlue text-[13px]">This is your Financial Overview Report</p>
            </div>
          </div>
        </header>
        {children}
      </main>
    </UserStoreProvider>
  );
}
