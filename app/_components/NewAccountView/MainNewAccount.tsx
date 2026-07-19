"use client";
import { useEffect, useState } from "react";
import CrossMark from "../CrossMark";
import InputField from "../InputField";
import CustomButton from "../CustomButtons/CustomButton";

export default function MainNewAccountView({
  isOpened,
  setIsOpened,
}: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpened) {
      setName("");
    }
  }, [isOpened]);

  function createNewAccount() {
    //TODO, implement the add account, calling real backend
    console.log("create new account");
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        onClick={() => setIsOpened(false)}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          isOpened ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-10 h-dvh w-full max-w-125 bg-white text-black shadow-xl transition-transform duration-300 ease-in-out p-4 ${
          isOpened ? "translate-x-0" : "translate-x-full"
        } grid grid-cols-1 auto-rows-min gap-y-2`}
      >
        <div className="flex justify-between">
          <h2 className="font-bold">New Account</h2>
          <CrossMark size={15} onClick={() => setIsOpened(false)} />
        </div>
        <p className="text-[0.8rem] text-gray-500 justify-self-start">
          Create a new account to track your transactions
        </p>

        <InputField
          gap={3}
          label={"Name"}
          type="text"
          value={name}
          onChange={setName}
          placeholderText="e.g Cash,Bank"
          extraCSS="mt-2"
        />

        <CustomButton
          handler={createNewAccount}
          backgroundColor="bg-addAccount"
          label="Create Account"
        ></CustomButton>
      </div>
    </>
  );
}
