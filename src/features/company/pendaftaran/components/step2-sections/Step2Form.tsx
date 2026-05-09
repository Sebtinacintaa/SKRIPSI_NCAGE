"use client";

import SectionAIdentitas from "./SectionAIdentitas";
import SectionBContact from "./SectionBContact";
import SectionCBadanUsaha from "./SectionCBadanUsaha";
import SectionDInformasiLainnya from "./SectionDInformasiLainnya";

export default function Step2Form() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-xl font-bold text-gray-800">
          Lengkapi Formulir Permintaan
        </h2>
      </div>

      <div className="space-y-16">
        <SectionAIdentitas />
        <SectionBContact />
        <SectionCBadanUsaha />
        <SectionDInformasiLainnya />
      </div>
    </div>
  );
}
