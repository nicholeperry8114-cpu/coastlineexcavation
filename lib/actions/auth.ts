"use server";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFormString } from "@/lib/utils/strings";

export async function signInAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  const next = getFormString(formData, "next") || "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
