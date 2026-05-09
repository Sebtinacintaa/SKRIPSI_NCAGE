"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Stepper from "./components/Stepper";
import FAQSection from "./components/FAQSection";

export default function BerandaView() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="w-full">
      {/* HERO SECTION */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FAF8F5 0%, #EEE4E2 50%, #D697A0 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch min-h-[500px]">
          {/* LEFT CONTENT */}
          <div className="w-full md:w-[55%] px-8 py-16 md:pl-16 flex flex-col justify-center">
            <h1 className="text-4xl md:text-4xl font-semibold text-black">
              Platform Registrasi
            </h1>

            <h2 className="text-5xl md:text-5xl font-semibold mt-6 text-[#86000D]">
              Kode NCAGE Indonesia
            </h2>

            <p className="text-gray-600 mt-5 max-w-md text-lg leading-relaxed">
              Solusi digital untuk pengajuan kode NCAGE secara cepat, aman, dan
              terintegrasi dalam satu sistem.
            </p>

            <div>
              <Link
                href="/pendaftaran-ncage"
                className="inline-block mt-10 bg-[#5D3A3A] text-white px-12 py-3.5 rounded-xl shadow hover:bg-[#4A2D2D] transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#5D3A3A]/20 text-lg font-semibold"
              >
                Mulai Pendaftaran
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="w-full md:w-1/2 flex items-end justify-end relative mt-8 md:mt-0">
            <div className="relative z-10 flex">
              <Image
                src="/puskod.png"
                alt="Gedung Puskod"
                width={500}
                height={600}
                className="w-auto h-[350px] md:h-[550px] object-cover object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* TAHAPAN ALUR SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* SECTION TITLE */}
          <div className="flex flex-col items-center mb-16 text-center">
            <div className="inline-block relative">
              <h3 className="text-3xl font-bold text-black tracking-tight">
                Tahapan Alur Penggunaan Kode NCAGE
              </h3>
              <div className="w-full h-[4px] bg-[#86000D] mt-3 rounded-full"></div>
            </div>
          </div>

          <Stepper activeStep={activeStep} setActiveStep={setActiveStep} />
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />
    </main>
  );
}
