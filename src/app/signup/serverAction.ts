"use server";
import { signIn } from "@/auth";
export const handleGoogleSignup = async () => {
  await signIn("google", { redirectTo: "http://localhost:3000" });
};
