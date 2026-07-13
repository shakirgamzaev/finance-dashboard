"use client";
import { proxy } from "valtio";

export const signUpFormStore = proxy<{
  name: string;
  email: string;
  password: string;
  error?: string | undefined;
}>({ name: "", email: "", password: "", error: undefined });

export function resetSignUpForm() {
  signUpFormStore.name = "";
  signUpFormStore.email = "";
  signUpFormStore.password = "";
  signUpFormStore.error = undefined
}
