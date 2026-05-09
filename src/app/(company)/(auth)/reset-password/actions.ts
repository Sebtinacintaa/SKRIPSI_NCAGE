"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

export type UpdatePasswordState = {
  error?: string;
};

export async function updatePassword(
  prevState: UpdatePasswordState | null,
  formData: FormData,
): Promise<UpdatePasswordState> {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Semua field wajib diisi." };
  }
  if (password.length < 8) {
    return { error: "Kata sandi minimal 8 karakter." };
  }
  if (password !== confirmPassword) {
    return { error: "Konfirmasi kata sandi tidak cocok." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[updatePassword]", error.message);
    if (error.message.toLowerCase().includes("session")) {
      return { error: "Sesi OTP sudah habis. Silakan ulangi proses lupa kata sandi." };
    }
    return { error: "Gagal memperbarui kata sandi. Silakan coba lagi." };
  }

  await supabase.auth.signOut();
  redirect("/login?passwordChanged=true");
}
