import AppLogo from "@/app/_components/AppLogo";
import { MobileNav } from "./_mobileNavViews/MobileNav";
import UserStoreProvider, { type User } from "./UserStoreProvider";
import Greeting from "./layoutHeaderComponents/Greeting";
import TopHeaderCategories from "./layoutHeaderComponents/TopHeaderCategories";

async function GetUser(): Promise<User> {
  //TODO: call my server and get the user data
  return {
    id: "1",
    name: "Shakir",
    email: "fake@example.com",
  };
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
        <header className="bg-linear-to-b from-blue-800 to-blue-600 h-[250px] lg:h-auto lg:pb-6">
          <div className="w-full max-w-[1400px] p-8 mx-auto flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <AppLogo
                width={130}
                height={25}
                className="hidden lg:block"
              ></AppLogo>
              <MobileNav></MobileNav>
              <TopHeaderCategories></TopHeaderCategories>

              <p className="text-white">UIcon</p>
            </div>

            <Greeting user={user}></Greeting>
          </div>
        </header>
        {children}
      </main>
    </UserStoreProvider>
  );
}
