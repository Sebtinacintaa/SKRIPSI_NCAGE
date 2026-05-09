"use client";

import React from "react";
import FileUploadDropzone from "@/src/components/ui/FileUploadDropzone";
import { useFormContext, Controller } from "react-hook-form";
import type { NcageRegistrationFormValues } from "@/src/schema";
import { motion } from "framer-motion";

const documentRequirements: { name: keyof NcageRegistrationFormValues; label: string; required: boolean; accept: string; downloadUrl?: string }[] = [
  {
    name: "surat_permohonan",
    label: "Surat Permohonan NCAGE",
    required: true,
    accept: ".pdf",
    downloadUrl: "#", // Add real URL here
  },
  {
    name: "surat_pernyataan",
    label: "Surat Pernyataan Kebenaran Data",
    required: true,
    accept: ".pdf",
    downloadUrl: "#", // Add real URL here
  },
  {
    name: "foto_kantor",
    label: "Foto Kantor (dengan GPS Map Camera)",
    required: true,
    accept: "image/*",
  },
  {
    name: "sk_domisili",
    label: "SK Domisili",
    required: false,
    accept: ".pdf",
  },
  {
    name: "akta_notaris",
    label: "Akta Notaris",
    required: true,
    accept: ".pdf",
  },
  {
    name: "sk_kemenkumham",
    label: "SK Kemenkumham",
    required: true,
    accept: ".pdf",
  },
  {
    name: "siup_nib",
    label: "SIUP/NIB ( Nomor Induk Berusaha)",
    required: true,
    accept: ".pdf",
  },
  {
    name: "company_profile",
    label: "Company Profile Perusahaan",
    required: true,
    accept: ".pdf",
  },
  {
    name: "npwp_perusahaan",
    label: "NPWP Perusahaan",
    required: true,
    accept: ".pdf",
  },
  {
    name: "surat_kuasa",
    label: "Surat Kuasa",
    required: false,
    accept: ".pdf",
  },
  {
    name: "daftar_isian_sam",
    label: "Daftar Isian SAM.GOV",
    required: false,
    accept: ".pdf",
  },
];

export default function Step1Upload() {
  const {
    control,
    formState: { errors },
  } = useFormContext<NcageRegistrationFormValues>();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {documentRequirements.map((doc, index) => {
          const fieldError = errors[doc.name];

          return (
            <motion.div 
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Controller
                name={doc.name}
                control={control}
                render={({ field }) => (
                  <FileUploadDropzone
                    label={doc.label}
                    name={doc.name}
                    required={doc.required}
                    accept={doc.accept}
                    value={field.value as File | null}
                    onChange={field.onChange}
                    error={fieldError?.message?.toString()}
                    downloadUrl={doc.downloadUrl}
                  />
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* New Subtle Info Footer */}
      <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <p className="text-[11px] font-medium">Khusus SAM.GOV: Maksimal 54 karakter untuk alamat perusahaan</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5 text-gray-400">
             <i className="ri-file-info-line text-sm"></i>
             <span className="text-[11px] font-medium">Format PDF</span>
           </div>
           <div className="flex items-center gap-1.5 text-gray-400">
             <i className="ri-database-2-line text-sm"></i>
             <span className="text-[11px] font-medium">Maks 5 MB</span>
           </div>
        </div>
      </div>
    </div>
  );
}
