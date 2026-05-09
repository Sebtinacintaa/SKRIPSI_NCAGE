"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "../constants";

export default function FAQSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section className="pb-32 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, #FFFFFF 0%, #FDF9F9 50%, #FDFBFB 100%)" }}>
      {/* Background Blur Ornaments */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-[#86000D]/3 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 -left-20 w-64 h-64 bg-[#B88673]/3 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-black tracking-tight mb-3">
              Pertanyaan Umum Seputar NCAGE (FAQ)
            </h3>
          </div>
          
          {/* Accordion List */}
          <div className="flex flex-col gap-5 w-full max-w-4xl">
            {FAQS.map((faq, index) => {
              const isFaqActive = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className={`bg-white/95 backdrop-blur-sm rounded-3xl border transition-all duration-500 overflow-hidden cursor-pointer ${
                    isFaqActive 
                      ? "border-[#86000D]/20 shadow-[0_15px_35px_rgba(134,0,13,0.05)]" 
                      : "border-gray-100 hover:border-gray-200 shadow-sm"
                  }`}
                  onClick={() => setActiveFaq(isFaqActive ? null : index)}
                >
                  <div className="p-7 md:px-10 flex justify-between items-center relative">
                    <h4 className={`text-[17px] font-semibold transition-colors duration-500 ${isFaqActive ? "text-[#86000D]/90" : "text-gray-600"}`}>
                      {faq.question}
                    </h4>
                    
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isFaqActive ? "bg-[#86000D] text-white rotate-180" : "bg-gray-50 text-gray-400"
                    }`}>
                      <i className="ri-arrow-down-s-line text-xl"></i>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isFaqActive && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="px-7 md:px-10 pb-8">
                          <div className="h-px bg-gray-50 w-full mb-6"></div>
                          <p className="text-gray-500 font-medium leading-relaxed text-[15px]">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
