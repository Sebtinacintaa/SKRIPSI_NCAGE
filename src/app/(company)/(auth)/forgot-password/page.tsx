"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useTransition, useEffect, useRef, useActionState } from "react";
import { sendOtp, verifyOtp } from "./actions";

/* ── OTP 6-box input ── */
function OtpBoxes({
  otp,
  setOtp,
  disabled,
}: {
  otp: string;
  setOtp: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const chars = otp.padEnd(6, " ").split("");
    chars[i] = val.slice(-1) || " ";
    setOtp(chars.join("").trimEnd());
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const chars = otp.padEnd(6, " ").split("");
      chars[i - 1] = " ";
      setOtp(chars.join("").trimEnd());
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 8 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[i] && otp[i] !== " " ? otp[i] : ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-10 h-13 text-center text-xl font-bold border-2 rounded-xl text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] transition-all border-[#E5E7EB] bg-white disabled:opacity-50"
        />
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [sentEmail, setSentEmail] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [secs, setSecs] = useState(0);

  // useTransition: setState called inside async callback — NOT directly in effect body
  const [sendPending, startSendTransition] = useTransition();

  // verifyOtp uses useActionState (redirects on success, so no step change needed)
  const [otpState, otpAction, otpPending] = useActionState(verifyOtp, null);

  // Countdown — setState called inside setTimeout callback (allowed by linter)
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => { setSecs((c) => c - 1); }, 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const doSendOtp = (email: string) => {
    setSendError(null);
    startSendTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      const result = await sendOtp(null, fd);
      if (result.error) {
        setSendError(result.error);
      } else if (result.success && result.email) {
        setSentEmail(result.email);
        setStep("otp");
        setOtp("");
        setSecs(60);
      }
    });
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    doSendOtp((fd.get("email") as string)?.trim().toLowerCase());
  };

  const handleResend = () => {
    if (secs > 0 || !sentEmail) return;
    doSendOtp(sentEmail);
  };

  const handleBack = () => {
    setStep("email");
    setOtp("");
    setSecs(0);
  };

  const isPending = sendPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-32 pb-12 bg-[#F5EEE8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B97A57]/20 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#B97A57]/10 rounded-full -translate-x-1/4 translate-y-1/4" />

      <div className="absolute top-6 left-10 flex items-center gap-3">
        <Image src="/logo-kemhan.png" alt="Logo Kemhan" width={55} height={55} className="object-contain" />
        <div>
          <h1 className="font-semibold text-[#000000] text-lg">Pelayanan NCAGE</h1>
          <p className="text-sm text-[#374151]">Pusat Kodifikasi</p>
        </div>
      </div>

      <div className="bg-white w-full max-w-[560px] p-10 sm:p-14 rounded-[15px] shadow-xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out">

        {/* Back button */}
        <div className="mb-8">
          {step === "otp" ? (
            <button onClick={handleBack} className="inline-flex items-center text-[#8B1E1E] font-medium hover:opacity-70 transition-opacity gap-2">
              <i className="ri-arrow-left-line text-xl" />
              <span className="text-sm">Kembali</span>
            </button>
          ) : (
            <Link href="/login" className="inline-flex items-center text-[#8B1E1E] font-medium hover:opacity-70 transition-opacity gap-2">
              <i className="ri-arrow-left-line text-xl" />
              <span className="text-sm">Kembali ke Login</span>
            </Link>
          )}
        </div>

        {/* ── STEP 1: Email ── */}
        {step === "email" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#8B1E1E]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-password-line text-3xl text-[#8B1E1E]" />
              </div>
              <h2 className="text-[#8B1E1E] font-semibold text-2xl mb-2 tracking-tight">Lupa Kata Sandi?</h2>
              <p className="text-gray-500 text-sm">Masukkan email terdaftar untuk menerima kode OTP 6 digit.</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Email Terdaftar</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B1E1E] transition-colors">
                    <i className="ri-mail-line text-xl" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Masukkan alamat email Anda"
                    className="w-full pl-12 pr-4 py-3.5 border border-[#E5E7EB] rounded-xl text-[#374151] font-medium placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1E1E]/20 focus:border-[#8B1E1E] transition-all"
                  />
                </div>
                {sendError && (
                  <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1 animate-in slide-in-from-top-1">
                    <i className="ri-error-warning-line" /> {sendError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#5D3A3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#4a2e2e] transition-all active:scale-[0.98] shadow-lg shadow-[#5D3A3A]/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? <><i className="ri-loader-4-line animate-spin" /> Mengirim...</> : <><i className="ri-send-plane-line" /> Kirim Kode OTP</>}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-check-line text-3xl text-emerald-600" />
              </div>
              <h2 className="text-[#8B1E1E] font-semibold text-2xl mb-2 tracking-tight">Masukkan Kode OTP</h2>
              <p className="text-gray-500 text-sm">
                Kode 6 digit telah dikirim ke <span className="font-semibold text-[#374151]">{sentEmail}</span>
              </p>
            </div>

            <form action={otpAction} className="flex flex-col gap-6">
              <input type="hidden" name="email" value={sentEmail} />
              <input type="hidden" name="otp" value={otp} />

              <OtpBoxes otp={otp} setOtp={setOtp} disabled={otpPending} />

              {otpState?.error && (
                <p className="text-center text-xs text-red-500 font-medium flex items-center justify-center gap-1 animate-in slide-in-from-top-1">
                  <i className="ri-error-warning-line" /> {otpState.error}
                </p>
              )}
              {sendError && (
                <p className="text-center text-xs text-red-500 font-medium flex items-center justify-center gap-1">
                  <i className="ri-error-warning-line" /> {sendError}
                </p>
              )}

              <button
                type="submit"
                disabled={otpPending || otp.replace(/\s/g, "").length !== 8}
                className="w-full bg-[#5D3A3A] text-white py-4 rounded-xl font-bold text-base hover:bg-[#4a2e2e] transition-all active:scale-[0.98] shadow-lg shadow-[#5D3A3A]/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {otpPending ? <><i className="ri-loader-4-line animate-spin" /> Memverifikasi...</> : <><i className="ri-shield-check-line" /> Verifikasi Kode</>}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-500">
              Tidak menerima kode?{" "}
              {secs > 0 ? (
                <span className="text-gray-400 font-medium">Kirim ulang dalam {secs}d</span>
              ) : (
                <button onClick={handleResend} disabled={isPending} className="text-[#8B1E1E] font-bold hover:opacity-80 transition-opacity disabled:opacity-50">
                  Kirim Ulang
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
