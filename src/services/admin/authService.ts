"use server";

import { createClient } from "@/src/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(
  prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi" };
  }

  // 1. Autentikasi lewat Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user) {
    console.error("Error admin login:", authError?.message);
    return { error: "Email atau kata sandi salah" };
  }

  // 2. Pastikan user ini terdaftar di tabel admins
  // (mencegah akun company biasa bisa login ke panel admin)
  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("id")
    .eq("id", authData.user.id)
    .single();

  if (adminError || !adminData) {
    await supabase.auth.signOut();
    return { error: "Akun ini tidak memiliki akses admin" };
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

  redirect("/admin/dashboard");
  return null;
}
