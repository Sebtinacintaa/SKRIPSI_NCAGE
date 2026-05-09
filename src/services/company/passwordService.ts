"use server";

import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";

// ─── Forgot Password ────────────────────────────────────────────────────────

export type SendOtpState = {
  error?: string;
  success?: boolean;
  email?: string;
};

export type VerifyOtpState = {
  error?: string;
};

export async function sendOtp(
  prevState: SendOtpState | null,
  formData: FormData,
): Promise<SendOtpState> {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) return { error: "Email wajib diisi." };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    console.error("[sendOtp]", error.message, error.status);
    if (error.status === 422) {
      return { error: "Email tidak ditemukan dalam sistem kami." };
    }
    if (error.message.toLowerCase().includes("rate")) {
      return { error: "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi." };
    }
    return { error: "Gagal mengirim kode OTP. Silakan coba lagi." };
  }

  return { success: true, email };
}

export async function verifyOtp(
  prevState: VerifyOtpState | null,
  formData: FormData,
): Promise<VerifyOtpState> {
  const supabase = await createClient();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const token = (formData.get("otp") as string)?.trim();

  if (!email || !token) {
    return { error: "Data tidak lengkap." };
  }

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.error("[verifyOtp]", error.message);
    return { error: "Kode OTP salah atau sudah kedaluwarsa. Silakan minta kode baru." };
  }

  redirect("/reset-password");
}

// ─── Reset Password ─────────────────────────────────────────────────────────

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
