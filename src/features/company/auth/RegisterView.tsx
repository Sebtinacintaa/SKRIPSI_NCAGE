"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { register } from "@/src/services/company/authService";

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#F5EEE8] relative pt-32 pb-20 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#B97A57]/20 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#B97A57]/20 rounded-full -translate-x-1/3 translate-y-1/3" />
      </div>
      <div className="absolute top-8 left-10 flex items-center gap-3 z-20">
        <Image src="/logo-kemhan.png" alt="Logo" width={55} height={55} />
        <div>
          <h1 className="font-semibold text-black text-lg leading-tight">Pelayanan NCAGE</h1>
          <p className="text-sm text-[#374151]">Pusat Kodifikasi</p>
        </div>
      </div>
      <div className="bg-white w-full max-w-5xl p-10 sm:p-14 rounded-[15px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out border border-white/50">
        <div className="relative mb-14 text-center">
          <Link href="/login" className="absolute left-0 top-1/2 -translate-y-1/2 text-[#374151] hover:text-[#8B1E1E] transition-all p-2">
            <i className="ri-arrow-left-line text-2xl"></i>
          </Link>
          <div className="inline-block space-y-3">
            <h2 className="text-[#8B1E1E] font-semibold text-2xl tracking-tight">Buat Akun Layanan NCAGE</h2>
            <p className="text-[#374151] font-normal text-sm mx-auto leading-relaxed opacity-80">
              Silakan lengkapi data berikut untuk membuat akun pendaftaran NCAGE Anda.
            </p>
          </div>
        </div>
        <form action={register} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-[#374151] ml-1">Nama Lengkap (PIC)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/40 group-focus-within:text-[#8B1E1E] transition-colors">
                  <i className="ri-user-line text-xl"></i>
                </div>
                <input id="fullName" name="fullName" type="text" placeholder="Masukkan Nama Narahubung" required className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
              </div>
            </div>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#374151] ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/40 group-focus-within:text-[#8B1E1E] transition-colors">
                  <i className="ri-mail-line text-xl"></i>
                </div>
                <input id="email" name="email" type="email" placeholder="Masukkan alamat email" required className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
              </div>
            </div>
            {/* Nama Perusahaan */}
            <div className="space-y-2">
              <label htmlFor="company" className="block text-sm font-medium text-[#374151] ml-1">Nama Perusahaan</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/40 group-focus-within:text-[#8B1E1E] transition-colors">
                  <i className="ri-building-line text-xl"></i>
                </div>
                <input id="company" name="company" type="text" placeholder="Masukkan Nama Perusahaan" required className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
              </div>
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-[#374151] ml-1">Nomor Telepon (WhatsApp)</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400/40 group-focus-within:text-[#8B1E1E] transition-colors">
                  <i className="ri-whatsapp-line text-xl"></i>
                </div>
                <input id="phone" name="phone" type="text" placeholder="Masukkan Nomor Telepon" required className="w-full pl-12 pr-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
              </div>
            </div>
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#374151] ml-1">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors flex items-center gap-1">
                  {password.length > 5 ? (
                    <i className="ri-checkbox-circle-fill text-xl text-green-500 animate-in zoom-in"></i>
                  ) : (
                    <i className={`${showPassword ? "ri-lock-unlock-line" : "ri-lock-line"} text-xl ${password.length > 0 ? "text-[#8B1E1E]" : "text-gray-400/40"}`}></i>
                  )}
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Kata Sandi" required className="w-full pl-12 pr-12 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors">
                  <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>
            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#374151] ml-1">Konfirmasi Kata Sandi</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors flex items-center gap-1">
                  {confirmPassword.length > 0 && confirmPassword === password ? (
                    <i className="ri-checkbox-circle-fill text-xl text-green-500 animate-in zoom-in"></i>
                  ) : (
                    <i className={`${showConfirmPassword ? "ri-lock-unlock-line" : "ri-lock-line"} text-xl ${confirmPassword.length > 0 ? "text-[#8B1E1E]" : "text-gray-400/40"}`}></i>
                  )}
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Masukkan Ulang Kata Sandi" required className="w-full pl-12 pr-12 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400/50 focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E] outline-none transition-all" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors">
                  <i className={showConfirmPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-10 px-2">
            <input type="checkbox" id="tnc" className="w-4 h-4 cursor-pointer accent-[#8B1E1E]" required />
            <label htmlFor="tnc" className="text-sm text-[#374151] cursor-pointer font-medium opacity-80">
              Saya menyetujui <span className="text-[#8B1E1E] font-bold">syarat dan ketentuan</span> serta <span className="text-[#8B1E1E] font-bold">kebijakan privasi</span>.
            </label>
          </div>
          <div className="mt-10 flex flex-col items-center gap-6">
            <button type="submit" className="w-full bg-[#5D3A3A] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-[#5D3A3A]/10 hover:bg-[#4a2e2e] transition-all active:scale-[0.98]">
              Daftar Akun Sekarang
            </button>
            <p className="text-[#374151] text-sm font-medium opacity-70">
              Sudah Punya Akun?{" "}
              <Link href="/login" className="text-[#8B1E1E] font-bold hover:opacity-80 transition-opacity">Masuk ke Akun</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterView;
