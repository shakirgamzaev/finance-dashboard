"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { LogOut } from "@/utils/AuthMethods/authentication";
import { userStore } from "@/app/dashboard/UserStoreProvider";
import ProfileSignOutComponent from "./ProfileSignOutComponent";

// Must run in THIS (client) module graph: stops FA from runtime-injecting its
// unlayered stylesheet, which would override Tailwind utility classes.
config.autoAddCss = false;

export default function ProfileIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user } = useSnapshot(userStore);
  const router = useRouter();

  async function logOut() {
    setIsLoggingOut(true);
    try {
      await LogOut();
      router.push("/signIn");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex size-9 items-center justify-center rounded-full bg-pink-500 text-white cursor-pointer"
      >
        P
      </button>
      {isOpen && (
        <div className="absolute top-[110%] right-0 mt-1 w-70 rounded-md border border-gray-200 bg-white shadow-lg flex flex-col overflow-clip">
          <div className="flex gap-3 w-full items-center p-3">
            <p className="flex size-7 shrink-0 items-center justify-center bg-pink-500 text-white rounded-full">
              P
            </p>
            <div className="min-w-0 grow">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.name}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          <button
            type="button"
            className="flex justify-start items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={faGear} className="size-3 text-gray-500" />
            <p className="text-sm text-gray-600">Manage account</p>
          </button>

          <div className="w-full h-px bg-gray-200"></div>

          <ProfileSignOutComponent
            handler={logOut}
            isLoggingOut={isLoggingOut}
          ></ProfileSignOutComponent>
        </div>
      )}
    </div>
  );
}
