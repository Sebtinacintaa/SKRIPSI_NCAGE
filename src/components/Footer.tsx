"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Footer() {
  const pathname = usePathname();

  if (pathname !== "/beranda") {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as any,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="bg-[#5D3A3A] text-white pt-16 pb-8 mt-10"
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Brand & Address */}
          <motion.div variants={itemVariants} className="flex flex-col md:pl-4">
            <div className="flex items-center gap-4 mb-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Image 
                  src="/logo-kemhan.png" 
                  alt="Logo Kemhan" 
                  width={64} 
                  height={64} 
                  className="w-16 h-16 object-contain"
                />
              </motion.div>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold tracking-wide">Pelayanan NCAGE</h3>
                <p className="text-lg font-medium">Pusat Kodifikasi</p>
              </div>
            </div>
            <p className="text-sm leading-[1.8] opacity-80 max-w-sm mt-6">
              Jl. Pd. Labu Raya, RT.6/RW.6 Pd. Labu, Cilandak, Kota Jakarta Selatan Daerah Khusus Ibukota Jakarta
            </p>
          </motion.div>

          {/* Column 2: Tautan */}
          <motion.div variants={itemVariants} className="flex flex-col md:pl-16">
            <h3 className="text-xl font-semibold mb-6">Tautan</h3>
            <ul className="flex flex-col gap-5">
              {[
                { label: "Beranda", href: "/beranda" },
                { label: "Pendaftaran NCAGE", href: "/pendaftaran-ncage" },
                { label: "Pantau Status", href: "/pantau-status" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group block w-fit">
                    <motion.span 
                      whileHover={{ x: 6 }}
                      className="inline-block text-sm opacity-80 group-hover:opacity-100 transition-all duration-300 font-medium"
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Kontak */}
          <motion.div variants={itemVariants} className="flex flex-col md:pl-10">
            <h3 className="text-xl font-semibold mb-5">Kontak</h3>
            <div className="flex flex-col gap-6">
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-4 cursor-default group w-fit">
                <div className="w-6 flex justify-center mt-0.5 opacity-90 group-hover:scale-110 transition-transform">
                  <i className="ri-phone-fill text-2xl"></i>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium opacity-80">Call Center Puskod</span>
                  <span className="text-sm font-medium">0812-8882-4545</span>
                </div>
              </motion.div>
              <motion.div whileHover={{ x: 4 }} className="flex items-start gap-5 cursor-default group w-fit">
                <div className="w-6 flex justify-center mt-0.5 opacity-90 group-hover:scale-110 transition-transform">
                  <i className="ri-time-fill text-2xl"></i>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium opacity-80">Jam Pelayanan</span>
                  <span className="text-sm font-medium whitespace-nowrap">Senin - Jumat, Jam 08.00 - 15.30 WIB</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* COPYRIGHT LINE */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-white/10 pt-8 mt-4 text-center"
        >
          <p className="text-sm font-medium tracking-wide opacity-60 hover:opacity-100 transition-opacity">
            &copy; 2210512016_Sebtina Cinta Anugrahini_Sistem Informasi
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
