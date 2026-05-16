"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/src/utils/supabase/client";
import LogoutModal from "./LogoutModal";
import NotificationDropdown, { Notification } from "./NotificationDropdown";

const navLinks = [
  { label: "Beranda", href: "/beranda" },
  { label: "Pendaftaran NCAGE", href: "/pendaftaran-ncage" },
  { label: "Pantau Status", href: "/pantau-status" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    company: string;
  } | null>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const isBeranda = pathname === "/beranda";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from("users")
        .select("name, company_name")
        .eq("id", session.user.id)
        .single();

      if (data && !error) {
        setUserData({ name: data.name, company: data.company_name });
      }
    }
  }, [supabase]);

  const fetchNotifications = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("notifications")
      .select("id, type, title, description, is_read, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(
        data.map((n) => ({
          id: n.id,
          type: n.type as Notification["type"],
          title: n.title,
          description: n.description,
          isRead: n.is_read,
          timestamp: new Date(n.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }))
      );
    }
  }, [supabase]);

  useEffect(() => {
    if (!isBeranda) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isBeranda]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserData();
        fetchNotifications();
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserData();
        fetchNotifications();
      } else {
        setUserData(null);
        setNotifications([]);
      }
    });

    window.addEventListener("profileUpdated", fetchUserData);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("profileUpdated", fetchUserData);
    };
  }, [supabase, fetchUserData, fetchNotifications]);

  const getInitials = (name: string) => {
    if (!name) return "??";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  const handleDeleteNotif = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from("notifications").delete().eq("id", id);
  };

  const handleMarkAllRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", session.user.id);
  };



  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="fixed top-0 left-0 w-full z-[100]">
      <nav
        className={`w-full transition-all duration-300 ${
          isBeranda
            ? scrolled
              ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-md py-4 lg:py-5"
              : "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm py-5 lg:py-6"
            : "bg-white border-b border-gray-200 shadow-sm py-4 lg:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-3">
          <Image
            src="/logo-kemhan.png"
            alt="Logo Kemhan"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-sm leading-tight">
              Pelayanan NCAGE
            </p>
            <p className="text-xs">Pusat Kodifikasi</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:bg-gray-100"
        >
          <i
            className={`text-2xl text-gray-700 transition-all ${mobileMenuOpen ? "ri-close-line rotate-90" : "ri-menu-line"}`}
          ></i>
        </button>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm transition-all px-4 py-2.5 rounded-xl ${
                    isActive
                      ? "bg-[#FDECEC] text-[#8B1E1E] font-semibold"
                      : "text-[#374151] hover:text-[#8B1E1E] font-medium"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {!isLoggedIn ? (
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-black hover:bg-gray-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-full bg-[#5D3A3A] text-sm font-medium text-white hover:bg-[#4A2D2D] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md shadow-sm"
            >
              Daftar
            </Link>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                }}
                className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 relative group ${
                  isNotifOpen
                    ? "bg-[#86000D] text-white shadow-lg shadow-[#86000D]/20"
                    : "bg-white hover:bg-[#86000D]/5 text-[#86000D]/60 border border-[#86000D]/15 shadow-sm"
                }`}
              >
                <i
                  className={`ri-notification-3-line text-[22px] transition-transform group-hover:rotate-12 ${isNotifOpen ? "text-white" : "text-[#86000D]/60"}`}
                ></i>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[#86000D] border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotif}
                onMarkAllAsRead={handleMarkAllRead}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-11 h-11 rounded-full overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center font-bold text-xs tracking-widest border-2 ${
                  isProfileOpen
                    ? "bg-[#86000D] text-white border-[#86000D] scale-105 shadow-md"
                    : "bg-white text-[#86000D]/80 border-[#86000D]/15 hover:bg-[#86000D]/5 shadow-sm"
                }`}
              >
                {userData ? getInitials(userData.name) : "??"}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    ></motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10, x: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 py-2.5 z-20 origin-top-right overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gray-50 mb-1.5 bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                            <i className="ri-building-2-line text-xl text-[#86000D]"></i>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-[13px] font-bold text-gray-900 truncate uppercase tracking-tight">
                              {userData?.name || "Memuat..."}
                            </p>
                            <p className="text-[11px] font-medium text-gray-500 truncate">
                              {userData?.company || "Perusahaan"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-[#8B1E1E] hover:bg-[#FDECEC]/50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-[#8B1E1E] transition-all">
                            <i className="ri-user-line text-lg"></i>
                          </div>
                          <span className="font-semibold">Profil Saya</span>
                        </Link>

                        <div className="px-3 py-1">
                          <div className="h-px bg-gray-100 w-full"></div>
                        </div>

                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsLogoutModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-red-500 transition-all">
                            <i className="ri-logout-box-line text-lg"></i>
                          </div>
                          <span className="font-semibold text-gray-500 group-hover:text-red-600">
                            Keluar Akun
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#FDECEC] text-[#8B1E1E] font-semibold"
                        : "text-[#374151] hover:bg-gray-50 hover:text-[#8B1E1E]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {!isLoggedIn ? (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl border border-gray-300 text-sm font-medium text-black text-center hover:bg-gray-50 transition-all"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#5D3A3A] text-sm font-medium text-white text-center hover:bg-[#4A2D2D] transition-all"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="px-6 py-4 border-t border-gray-100 space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <i className="ri-user-line text-lg text-gray-400"></i>
                  <span className="font-semibold">Profil Saya</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <i className="ri-logout-box-line text-lg text-gray-400"></i>
                  <span className="font-semibold">Keluar Akun</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;
