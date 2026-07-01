"use client"
import { proxy } from "valtio";

export const isShownStore = proxy<{ isShown: boolean }>({ isShown: false });
