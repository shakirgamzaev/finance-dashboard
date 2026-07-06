"use client";

import AuthButton from "@/app/_components/AuthButton";
import GoogleSignInBtn from "@/app/_components/GoogleSignInBtn";
import InputField from "@/app/_components/InputField";
import Link from "next/link";

export default function SignIn() {
  function googleSignIn() {}

  function emailPasswordSignIn() {}

  return (
    <div className=" flex flex-col items-center gap-6 bg-background p-9 max-w-[550px] mx-auto rounded-[12px] shadow-md">
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-bold">Sign in To Finance</h2>
        <h3 className="text-[0.8rem] text-textGray font-medium">
          Welcome back! Please sign in to continue
        </h3>
      </div>
      <GoogleSignInBtn handler={googleSignIn}></GoogleSignInBtn>
      <div className="flex gap-3 items-center w-full">
        <div className="h-[1px] grow bg-[rgba(0,0,0,0.2)]"></div>
        <p className="text-textGray">or</p>
        <div className="h-[1px] grow bg-[rgba(0,0,0,0.2)]"></div>
      </div>

      <InputField gap={8} label="Email address" type="email"></InputField>

      <InputField gap={8} label="Password" type="password"></InputField>

      <AuthButton
        label="Sign in"
        handler={emailPasswordSignIn}
        additionalStyling="mt-3"
      ></AuthButton>

      <div className="flex gap-1.5 items-center text-[0.85rem]">
        <p className="text-textGray">Don&apos;t have an account?</p>
        <Link href="/signUp" className="font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
