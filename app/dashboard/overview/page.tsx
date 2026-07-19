"use client";
import { useState } from "react";
import MainNewAccountView from "@/app/_components/NewAccountView/MainNewAccount";
import CustomButton from "@/app/_components/CustomButtons/CustomButton";

export default function MainDashBoard() {
  const [isNewAccountsOpened, setIsNewAccountsOpened] = useState(false);

  return (
    <div className="flex justify-center pt-2 px-2">
      <CustomButton
        handler={() => setIsNewAccountsOpened(true)}
        label="Add an account"
        backgroundColor="bg-addAccount"
      />
      <MainNewAccountView
        isOpened={isNewAccountsOpened}
        setIsOpened={setIsNewAccountsOpened}
      />
    </div>
  );
}
