"use client";
import { proxy } from "valtio";

export const signInFormStore = proxy<{
  email: string;
  password: string;
  error?: string | undefined;
}>({ email: "", password: "", error: undefined });

export function resetSignInForm() {
  signInFormStore.email = "";
  signInFormStore.password = "";
  signInFormStore.error = undefined;
}
