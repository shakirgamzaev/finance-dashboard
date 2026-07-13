import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppLogo from "@/app/_components/AppLogo";
import { auth } from "@/utils/auth";
import { MobileNav } from "./_mobileNavViews/MobileNav";
import UserStoreProvider, { type User } from "./UserStoreProvider";
import Greeting from "./layoutHeaderComponents/Greeting";
import TopHeaderCategories from "./layoutHeaderComponents/TopHeaderCategories";
import ProfileIcon from "../_components/ProfleIcon/ProfileIcon";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/signIn");
  }

  const user: User = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

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

              <ProfileIcon></ProfileIcon>
            </div>

            <Greeting user={user}></Greeting>
          </div>
        </header>
        {children}
      </main>
    </UserStoreProvider>
  );
}
