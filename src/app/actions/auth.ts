"use server";

import { createClient } from "@/lib/supabase/server";

export async function loginWithPin(pin: string) {
  // We hardcode the pin here since it's a private app, or read from env.
  const SECRET_PIN = process.env.SECRET_PIN || "12904";
  
  if (pin !== SECRET_PIN) {
    throw new Error("Incorrect PIN. Please try again.");
  }

  const supabase = await createClient();
  
  const email = process.env.SECRET_LOGIN_EMAIL;
  const password = process.env.SECRET_LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing SECRET_LOGIN_EMAIL or SECRET_LOGIN_PASSWORD in .env.local.");
  }

  // 1. Attempt to sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError && signInData?.session) {
    return { success: true };
  }

  // 2. If sign-in failed due to invalid credentials, attempt auto-signup on first launch
  const isInvalidCredentials = 
    signInError?.message?.toLowerCase().includes("invalid login credentials") ||
    signInError?.message?.toLowerCase().includes("user not found");

  if (isInvalidCredentials) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      throw new Error(`Signup failed: ${signUpError.message}`);
    }

    if (signUpData?.session) {
      return { success: true };
    }

    // Try signing in once more in case signup was auto-confirmed
    const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!retryError && retrySignIn?.session) {
      return { success: true };
    }

    throw new Error(
      "Account was created, but email confirmation is required by your Supabase project. " +
      "Please confirm the verification email or disable 'Confirm email' under Supabase Dashboard > Authentication > Providers > Email."
    );
  }

  // If there was any other error (rate limit, service down, etc.)
  throw new Error(signInError?.message || "Authentication failed.");
}
