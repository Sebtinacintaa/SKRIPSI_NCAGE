"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/src/services/company/authService";

const LoginView = () => {
  const [state, formAction] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showExpiredBanner, setShowExpiredBanner] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("passwordChanged") === "true") {
      setShowSuccessBanner(true);
      const t = setTimeout(() => setShowSuccessBanner(false), 6000);
      return () => clearTimeout(t);
    }
    if (searchParams.get("expired") === "true") {
      setShowExpiredBanner(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 pb-12 bg-[#F5EEE8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B97A57]/20 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#B97A57]/10 rounded-full -translate-x-1/4 translate-y-1/4" />

      <div className="absolute top-6 left-10 flex items-center gap-3">
        <Image
          src="/logo-kemhan.png"
          alt="Logo Kemhan"
          width={55}
          height={55}
          className="object-contain"
        />
        <div>
          <h1 className="font-semibold text-[#000000] text-lg">
            Pelayanan NCAGE
          </h1>
          <p className="text-sm text-[#374151]">Pusat Kodifikasi</p>
        </div>
      </div>

      {/* Password changed success banner */}
      {showSuccessBanner && (
        <div className="w-full max-w-[560px] mb-4 z-10 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-5 py-4 text-sm animate-in slide-in-from-top-3 duration-500 shadow-sm">
          <i className="ri-checkbox-circle-fill text-xl text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Kata sandi berhasil diperbarui!</p>
            <p className="text-emerald-700 text-xs mt-0.5">
              Silakan masuk dengan kata sandi baru Anda.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="ml-auto text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>
      )}

      {showExpiredBanner && (
        <div className="w-full max-w-[560px] mb-4 z-10 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm animate-in slide-in-from-top-3 duration-500 shadow-sm">
          <i className="ri-time-line text-xl text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="font-semibold">Sesi Anda telah berakhir. Silakan masuk kembali.</p>
        </div>
      )}

      <div
        className={`bg-[#FFFFFF] w-full max-w-[560px] p-10 sm:p-14 rounded-[15px] shadow-xl shadow-gray-200/40 z-10 border border-gray-100/50 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out ${state?.error ? "animate-shake" : ""}`}
      >
        <h2 className="text-center text-[#8B1E1E] font-semibold text-2xl mb-8 tracking-tight">
          Selamat Datang di Layanan NCAGE
        </h2>

        <form action={formAction} className="flex flex-col">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Email
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/40 group-focus-within:text-[#8B1E1E] transition-colors">
                <i className="ri-mail-line text-xl"></i>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Masukkan alamat email"
                required
                className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:outline-none focus:ring-4 transition-all ${
                  state?.error
                    ? "border-red-400 focus:ring-red-400/10 focus:border-red-400 bg-red-50/10"
                    : "border-[#E5E7EB]/70 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E]"
                }`}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Kata Sandi
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors flex items-center gap-1">
                <i className="ri-lock-line text-xl text-gray-400/40"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); }}
                placeholder="Masukkan Kata Sandi"
                required
                className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:outline-none focus:ring-4 transition-all ${
                  state?.error
                    ? "border-red-400 focus:ring-red-400/10 focus:border-red-400 bg-red-50/10"
                    : "border-[#E5E7EB]/70 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors"
              >
                <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
              </button>
            </div>
            {state?.error && (
              <p className="mt-2 text-xs text-red-500 font-medium animate-in slide-in-from-top-1">
                {state.error}
              </p>
            )}
          </div>

          <div className="text-right mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-[#8B1E1E] font-medium hover:opacity-80 transition-opacity"
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5D3A3A] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#4a2e2e] transition-all active:scale-[0.98] shadow-lg shadow-[#5D3A3A]/10"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-base mt-8 text-gray-500 font-medium">
          Belum memiliki akun?{" "}
          <Link
            href="/register"
            className="text-[#8B1E1E] font-bold hover:opacity-80 transition-opacity"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginView;
