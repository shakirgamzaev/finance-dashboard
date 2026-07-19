"use client";

import AuthButton from "@/app/_components/CustomButtons/AuthButton";
import GoogleSignInBtn from "@/app/_components/CustomButtons/GoogleSignInBtn";
import InputField from "@/app/_components/InputField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { authClient } from "@/utils/auth-client";
import { signInFormStore, resetSignInForm } from "./signInFormStore";

export default function SignIn() {
  const formSnap = useSnapshot(signInFormStore);
  const router = useRouter();

  function googleSignIn() {}

  async function emailPasswordSignIn() {
    signInFormStore.error = undefined;
    const { error } = await authClient.signIn.email({
      email: signInFormStore.email,
      password: signInFormStore.password,
    });
    if (error) {
      signInFormStore.error = error.message ?? "auth Error";
      return;
    }
    resetSignInForm();
    router.push("/dashboard");
  }

  return (
    <div className=" flex flex-col items-center gap-6 bg-background p-9 max-w-[550px] mx-auto rounded-[12px] shadow-md min-h-dvh lg:min-h-0">
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

      <InputField
        gap={8}
        label="Email address"
        type="email"
        value={formSnap.email}
        onChange={(value) => {
          signInFormStore.email = value;
        }}
      ></InputField>

      <InputField
        gap={8}
        label="Password"
        type="password"
        value={formSnap.password}
        onChange={(value) => {
          signInFormStore.password = value;
        }}
      ></InputField>

      <AuthButton
        label="Sign in"
        handler={emailPasswordSignIn}
        additionalStyling="mt-3"
      ></AuthButton>

      {formSnap.error && (
        <p className="text-[0.85rem] text-red-600" role="alert">
          {formSnap.error}
        </p>
      )}

      <div className="flex gap-1.5 items-center text-[0.85rem]">
        <p className="text-textGray">Don&apos;t have an account?</p>
        <Link href="/signUp" className="font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
