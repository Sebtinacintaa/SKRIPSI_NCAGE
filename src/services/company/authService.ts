"use server";

import { createClient } from "@/src/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !fullName || !company || !company || !phone) {
    return;
  }

  if (password !== confirmPassword) {
    return;
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return;
  }

  if (authData.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      name: fullName,
      company_name: company,
      phone_number: phone,
      email: email,
    });

    if (insertError) {
      console.error("Error insert ke tabel users:", insertError);
    }

    // Sign out immediately — user harus login manual
    await supabase.auth.signOut();
  }

  redirect("/login?registered=true");
}

export async function login(
  prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error login:", error.message);
    return { error: "Email atau kata sandi salah" };
  }

  // Set 1-hour session cookie
  const cookieStore = await cookies();
  cookieStore.set("ncage_login_time", Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600,
    path: "/",
  });

  redirect("/beranda");
  return null;
}
