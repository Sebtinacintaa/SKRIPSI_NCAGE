"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/src/utils/supabase/client";

type ToastState = { visible: boolean; type: "success" | "error"; title: string; message: string };

export default function ProfileView() {
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from("users").select("name, email, company_name, phone_number").eq("id", session.user.id).single();
        if (data) { setFullName(data.name || ""); setEmail(data.email || ""); setCompanyName(data.company_name || ""); setPhoneNumber(data.phone_number || ""); }
      }
    };
    fetchProfile();
  }, [supabase]);

  const [toast, setToast] = useState<ToastState>({ visible: false, type: "success", title: "", message: "" });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: "success" | "error", title: string, message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ visible: true, type, title, message });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  };

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  const getInitials = (name: string) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const avatarColors = ["#5D3A3A", "#86000D", "#B88673", "#7A4E4E"];
  const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const handleSave = async () => {
    if (!fullName.trim()) { showToast("error", "Gagal Menyimpan", "Nama Lengkap tidak boleh kosong."); return; }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");
      const { error } = await supabase.from("users").update({ name: fullName, company_name: companyName, phone_number: phoneNumber }).eq("id", session.user.id);
      if (error) throw error;
      try {
        const adminSupabase = (await import("@/src/utils/supabase/admin")).createAdminClient();
        await adminSupabase.from("notifications").insert({ user_id: session.user.id, type: "security", title: "Profil Berhasil Diperbarui", description: "Informasi profil akun Anda telah berhasil diperbarui." });
      } catch (_) {}
      showToast("success", "Berhasil Disimpan", "Informasi profil Anda telah diperbarui.");
      window.dispatchEvent(new CustomEvent("profileUpdated"));
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("error", "Gagal Menyimpan", "Terjadi kesalahan saat memperbarui profil.");
    }
  };

  return (
    <>
      {toast.visible && <div className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300" onClick={() => setToast((t) => ({ ...t, visible: false }))} />}
      <div className={`fixed top-24 right-8 z-[100] w-full max-w-sm transition-all duration-500 ease-out ${toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"}`}>
        <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border backdrop-blur-md ${toast.type === "success" ? "bg-white/95 border-green-100" : "bg-white/95 border-red-100"}`}>
          <div className={`rounded-xl w-10 h-10 flex items-center justify-center shrink-0 shadow-sm ${toast.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
            <i className={`text-xl ${toast.type === "success" ? "ri-checkbox-circle-fill text-green-500" : "ri-error-warning-fill text-red-500"}`}></i>
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{toast.title}</h4>
            <p className="text-xs text-gray-600 mt-1 font-medium">{toast.message}</p>
          </div>
          <button onClick={() => setToast((t) => ({ ...t, visible: false }))} className="text-gray-400 hover:text-gray-900 transition shrink-0 p-1 rounded-lg hover:bg-gray-100">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
      </div>
      <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center pt-28 pb-10 px-6">
        <div className="bg-white w-full max-w-5xl rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 relative">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/beranda" className="text-gray-600 hover:text-black transition"><i className="ri-arrow-left-line text-2xl"></i></Link>
            <h1 className="text-2xl font-semibold text-black">Informasi Akun</h1>
          </div>
          <div className="flex justify-center mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                {profileImage
                  ? <Image src={profileImage} alt="Profile Avatar" width={96} height={96} className="object-cover w-full h-full" />
                  : <div className="w-full h-full text-white flex items-center justify-center text-3xl font-semibold tracking-wider" style={{ backgroundColor: getAvatarColor(fullName) }}>{getInitials(fullName)}</div>}
              </div>
              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={(e) => { const file = e.target.files?.[0]; if (file) setProfileImage(URL.createObjectURL(file)); }} />
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-[#86000D] text-white rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#5D3A3A] transition">
                <i className="ri-add-line text-sm font-bold"></i>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86000D]/20 focus:border-[#86000D] transition text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input type="email" value={email} disabled placeholder="Masukkan alamat email" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed text-sm" />
              <p className="text-[10px] text-gray-400 mt-0.5 ml-1">* Email tidak dapat diubah</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nama Perusahaan</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Masukkan nama perusahaan" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86000D]/20 focus:border-[#86000D] transition text-sm" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Nomor Telepon (WhatsApp)</label>
              <div className="relative">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"><i className="ri-phone-line text-lg"></i></div>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Masukkan nomor telepon" className="w-full pl-4 pr-11 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86000D]/20 focus:border-[#86000D] transition text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-semibold text-gray-700">Kata Sandi</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86000D]/20 focus:border-[#86000D] transition text-sm pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-semibold text-gray-700">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Masukkan ulang kata sandi" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#86000D]/20 focus:border-[#86000D] transition text-sm pr-12" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <i className={showConfirmPassword ? "ri-eye-line" : "ri-eye-off-line"}></i>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <button onClick={handleSave} className="w-full bg-[#5D3A3A] hover:bg-[#4A2D2D] text-white font-semibold text-lg py-4 rounded-2xl transition shadow-md">Simpan</button>
          </div>
        </div>
      </main>
    </>
  );
}
