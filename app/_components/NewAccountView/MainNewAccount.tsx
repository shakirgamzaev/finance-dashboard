"use client";
import { faSquareCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { showToast } from "@/app/dashboard/ValtioStores/toastStore";
import { createAccount } from "@/utils/AuthMethods/accountMethods";
import CrossMark from "../CrossMark";
import CustomButton from "../CustomButtons/CustomButton";
import InputField from "../InputField";

export default function MainNewAccountView({
  isOpened,
  setIsOpened,
  onCreated,
}: {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpened) {
      setName("");
    }
  }, [isOpened]);

  //call fastapi backend to insert new account into the user
  async function createNewAccount() {
    setIsProcessing(true);
    try {
      await createAccount(name);
      setIsOpened(false);
      onCreated?.();
      showToast(
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSquareCheck} className="size-4" />
          <span>Account created!</span>
        </div>,
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function deleteAccount() {
    //TODO, implement the delete account, calling real backend
    setIsProcessing(true);
    try {
      console.log("delete account");
    } finally {
      setIsProcessing(false);
    }
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
          disabled={isProcessing}
        ></CustomButton>

        <CustomButton
          handler={deleteAccount}
          backgroundColor="bg-red-600"
          disabled={isProcessing}
          label={
            <div className="flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faTrash} className="size-3.5" />
              <span>Delete Account</span>
            </div>
          }
        ></CustomButton>
      </div>
    </>
  );
}
