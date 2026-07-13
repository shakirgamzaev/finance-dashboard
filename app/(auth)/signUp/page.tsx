"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import GoogleSignInBtn from "@/app/_components/GoogleSignInBtn";
import InputField from "@/app/_components/InputField";
import AuthButton from "@/app/_components/AuthButton";
import { signUpFormStore, resetSignUpForm } from "./signUpFormStore";
import { authClient } from "@/utils/auth-client";

export default function SignUp() {
  const formSnap = useSnapshot(signUpFormStore);
  const router = useRouter();

  function googleSignUp() {
    //TODO: will implement it later
  }

  async function signUp() {
    const { error } = await authClient.signUp.email({
      name: signUpFormStore.name,
      email: signUpFormStore.email,
      password: signUpFormStore.password,
    });
    if (error) {
      signUpFormStore.error = error.message ?? "auth Error ";
      return;
    }
    resetSignUpForm();
    // Cookie is now set; the dashboard layout verifies the session
    // server-side and populates userStore via UserStoreProvider.
    router.push("/dashboard");
  }

  return (
    <div className=" flex flex-col items-center gap-5 bg-background p-9 max-w-[550px] mx-auto rounded-[12px] shadow-md min-h-dvh lg:min-h-0 ">
      <div className="flex flex-col items-center gap-0.5">
        <h2 className="font-bold">Sign Up to Finance</h2>
        <h3 className="text-[0.8rem] text-textGray font-medium">
          Sign Up to Finance!
        </h3>
      </div>
      <GoogleSignInBtn handler={googleSignUp}></GoogleSignInBtn>
      <div className="flex gap-3 items-center w-full">
        <div className="h-[1px] grow bg-[rgba(0,0,0,0.2)]"></div>
        <p className="text-textGray">or</p>
        <div className="h-[1px] grow bg-[rgba(0,0,0,0.2)]"></div>
      </div>

      <InputField
        gap={8}
        label="Name"
        type="text"
        value={formSnap.name}
        onChange={(value) => {
          signUpFormStore.name = value;
        }}
      ></InputField>

      <InputField
        gap={8}
        label="Email address"
        type="email"
        value={formSnap.email}
        onChange={(value) => {
          signUpFormStore.email = value;
        }}
      ></InputField>

      <InputField
        gap={8}
        label="Password"
        type="password"
        value={formSnap.password}
        onChange={(value) => {
          signUpFormStore.password = value;
        }}
      ></InputField>

      <AuthButton
        label="Sign Up"
        handler={signUp}
        additionalStyling="mt-3"
      ></AuthButton>

      {formSnap.error && (
        <p className="text-[0.85rem] text-red-600" role="alert">
          {formSnap.error}
        </p>
      )}

      <div className="flex gap-1.5 items-center text-[0.85rem]">
        <p className="text-textGray">Already have an account?</p>
        <Link href="/signIn" className="font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
