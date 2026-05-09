"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState } from "react";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 pb-12 bg-[#F5EEE8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B97A57]/20 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#B97A57]/10 rounded-full -translate-x-1/4 translate-y-1/4" />

      {/* Logo */}
      <div className="absolute top-6 left-10 flex items-center gap-3">
        <Image src="/logo-kemhan.png" alt="Logo Kemhan" width={55} height={55} className="object-contain" />
        <div>
          <h1 className="font-semibold text-[#000000] text-lg">Pelayanan NCAGE</h1>
          <p className="text-sm text-[#374151]">Pusat Kodifikasi</p>
        </div>
      </div>

      <div className="bg-white w-full max-w-[560px] p-10 sm:p-14 rounded-[15px] shadow-xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out">

        {/* Back to login */}
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center text-[#8B1E1E] font-medium hover:opacity-70 transition-opacity gap-2"
          >
            <i className="ri-arrow-left-line text-xl" />
            <span className="text-sm">Kembali ke Login</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#8B1E1E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shield-keyhole-line text-3xl text-[#8B1E1E]" />
          </div>
          <h2 className="text-[#8B1E1E] font-semibold text-2xl mb-2 tracking-tight">Buat Kata Sandi Baru</h2>
          <p className="text-gray-500 text-sm">
            Identitas Anda telah diverifikasi. Silakan buat kata sandi baru.
          </p>
        </div>

        {/* Error banner */}
        {state?.error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-in slide-in-from-top-2">
            <i className="ri-error-warning-line text-lg mt-0.5 flex-shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-5">
          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Kata Sandi Baru
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B1E1E] transition-colors">
                <i className="ri-lock-line text-xl" />
              </div>
              <input
                type={showPw ? "text" : "password"}
                name="password"
                required
                minLength={8}
                placeholder="Minimal 8 karakter"
                className="w-full pl-12 pr-12 py-3.5 border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors"
              >
                <i className={showPw ? "ri-eye-line" : "ri-eye-off-line"} />
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Konfirmasi Kata Sandi
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B1E1E] transition-colors">
                <i className="ri-lock-2-line text-xl" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-12 pr-12 py-3.5 border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors"
              >
                <i className={showConfirm ? "ri-eye-line" : "ri-eye-off-line"} />
              </button>
            </div>
          </div>

          {/* Requirements hint */}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <i className="ri-information-line" />
            Kata sandi harus minimal 8 karakter.
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#5D3A3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#4a2e2e] transition-all active:scale-[0.98] shadow-lg shadow-[#5D3A3A]/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {isPending ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <i className="ri-save-line" />
                Simpan Kata Sandi Baru
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
