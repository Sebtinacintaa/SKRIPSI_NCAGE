"use client";

import { motion, AnimatePresence } from "framer-motion";
import { STEPS } from "../constants";

interface StepperProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export default function Stepper({ activeStep, setActiveStep }: StepperProps) {
  return (
    <>
      {/* STEPPER COMPONENT */}
      <div className="relative mb-16 max-w-5xl mx-auto">
        {/* Base Line Background (Connecting Icon Centers - Precisely 12.5% to 87.5%) */}
        <div className="absolute top-7 left-[12.5%] right-[12.5%] h-[2px] bg-gray-100 z-0 hidden md:block"></div>
        
        {/* Active Progress Line (Connecting Icon Centers) */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${activeStep * 25}%` }}
          className="absolute top-7 left-[12.5%] h-[2px] bg-[#86000D] z-0 hidden md:block"
          transition={{ duration: 0.7, ease: "easeInOut" }}
        ></motion.div>

        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-12 md:gap-0">
          {STEPS.map((step, index) => {
            const isActive = index === activeStep;
            const isPassed = index < activeStep;
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center cursor-pointer group w-full md:w-1/4"
                onClick={() => setActiveStep(index)}
              >
                {/* Step Icon Circle */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative z-10 border-2 ${
                    isActive || isPassed 
                      ? "bg-[#86000D] border-[#86000D] text-white shadow-[0_8px_20px_rgba(134,0,13,0.15)]" 
                      : "bg-white border-gray-100 text-gray-400 group-hover:border-gray-200"
                  }`}
                >
                  <i className={step.icon}></i>
                </motion.div>
                
                {/* Step Label */}
                <p className={`mt-5 text-center transition-all duration-500 ${
                  isActive ? "text-black font-bold text-[15px]" : "text-gray-400 font-semibold text-[14px]"
                }`}>
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESCRIPTION CONTAINER */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative p-10 bg-white border border-gray-100 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.04)] min-h-[140px] flex items-center"
          >
            <div className="flex gap-8 items-start relative z-10">
              {/* Step Number Badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#86000D]/5 flex items-center justify-center shrink-0 border border-[#86000D]/10">
                <span className="text-[#86000D] font-extrabold text-xl">{activeStep + 1}</span>
              </div>
              
              <p className="text-[17px] text-gray-700 font-medium leading-relaxed pt-2">
                {STEPS[activeStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
