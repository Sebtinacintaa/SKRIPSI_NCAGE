"use client";

import Image from "next/image";
import { useState, useActionState, useEffect } from "react";
import { adminLogin } from "@/src/services/admin/authService";

const AdminLoginView = () => {
  const [state, formAction] = useActionState(adminLogin, null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_remember_email");
    if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
  }, []);

  const handleFormSubmit = () => {
    if (rememberMe) { localStorage.setItem("admin_remember_email", email); }
    else { localStorage.removeItem("admin_remember_email"); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col bg-white relative">
        <div className="absolute top-8 left-10 flex items-center gap-3">
          <Image src="/logo-kemhan.png" alt="Logo Kemhan" width={52} height={52} className="object-contain" />
          <div>
            <p className="font-semibold text-[#1a1a1a] text-[17px] leading-tight">Pelayanan NCAGE</p>
            <p className="text-[13px] text-[#6B7280]">Pusat Kodifikasi</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-10 sm:px-16 lg:px-20 pt-28 pb-16">
          <div className="w-full max-w-[420px]">
            <h1 className="text-[28px] font-semibold text-[#8B1E1E] mb-10 leading-snug text-center tracking-tight">Selamat Datang Admin</h1>
            <form action={formAction} onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-semibold text-[#374151] ml-1">Email</label>
                <input id="email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan alamat email" required autoComplete="email"
                  className={`w-full px-5 py-4 border rounded-[15px] text-[15px] text-[#374151] placeholder:text-gray-400 outline-none transition-all ${state?.error ? "border-red-400 focus:ring-4 focus:ring-red-400/10 focus:border-red-400 bg-red-50/10" : "border-gray-200 focus:border-[#8B1E1E] focus:ring-4 focus:ring-[#8B1E1E]/5"}`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-[13px] font-semibold text-[#374151] ml-1">Kata Sandi</label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Kata Sandi" required autoComplete="current-password"
                    className={`w-full px-5 py-4 pr-12 border rounded-[15px] text-[15px] text-[#374151] placeholder:text-gray-400 outline-none transition-all ${state?.error ? "border-red-400 focus:ring-4 focus:ring-red-400/10 focus:border-red-400 bg-red-50/10" : "border-gray-200 focus:border-[#8B1E1E] focus:ring-4 focus:ring-[#8B1E1E]/5"}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1E1E] transition-colors" aria-label="Toggle password visibility">
                    <i className={showPassword ? "ri-eye-line text-lg" : "ri-eye-off-line text-lg"} />
                  </button>
                </div>
                {state?.error && <p className="text-[12px] text-red-500 font-medium mt-0.5 flex items-center gap-1"><i className="ri-error-warning-line" />{state.error}</p>}
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group w-fit ml-1">
                <div onClick={() => setRememberMe(!rememberMe)} className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-all ${rememberMe ? "bg-[#8B1E1E] border-[#8B1E1E]" : "border-gray-300 bg-white group-hover:border-[#8B1E1E]"}`}>
                  {rememberMe && <i className="ri-check-line text-white text-[10px] leading-none" />}
                </div>
                <span className="text-[13px] text-[#8B1E1E]/75 font-medium select-none">Ingat saya?</span>
              </label>
              <button type="submit" className="w-full mt-3 bg-[#5D2E2E] hover:bg-[#4a2424] active:scale-[0.98] text-white py-4 rounded-[15px] font-bold text-[16px] transition-all duration-300 ease-out hover:scale-[1.02] shadow-lg shadow-[#5D2E2E]/20">
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-[#F0E6DC] items-center justify-center relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-[280px] h-[280px] bg-[#D4B8A8]/30 rounded-full" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[220px] h-[220px] bg-[#C4A090]/20 rounded-full" />
        <div className="relative z-10 w-[85%] max-w-[500px]">
          <Image src="/admin-illustration-login.png" alt="Admin Login Illustration" width={560} height={480} className="w-full h-auto object-contain drop-shadow-xl" priority />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginView;
