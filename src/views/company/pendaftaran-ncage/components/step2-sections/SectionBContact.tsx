import React from "react";
import { useFormContext } from "react-hook-form";
import type { NcageRegistrationFormValues } from "@/src/schema";

export default function SectionBContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<NcageRegistrationFormValues>();

  const inputClass =
    "w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-500 font-medium focus:border-[#8a1515] focus:ring-1 focus:ring-[#8a1515] outline-none transition-all placeholder-gray-300";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <section>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>
            Nama Pemohon <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama pemohon"
            className={`${inputClass} ${
              errors.nama_pemohon ? "border-red-500" : ""
            }`}
            {...register("nama_pemohon")}
          />
          {errors.nama_pemohon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nama_pemohon.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Nomor Identitas (KTP/SIM) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor identitas"
            className={`${inputClass} ${
              errors.nomor_identitas ? "border-red-500" : ""
            }`}
            {...register("nomor_identitas")}
          />
          {errors.nomor_identitas && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nomor_identitas.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Masukkan alamat"
            className={`${inputClass} ${
              errors.alamat_pemohon ? "border-red-500" : ""
            }`}
            {...register("alamat_pemohon")}
          />
          {errors.alamat_pemohon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.alamat_pemohon.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Nomor telepon/ HP (Pemohon) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor telepon / HP"
            className={`${inputClass} ${
              errors.no_hp_pemohon ? "border-red-500" : ""
            }`}
            {...register("no_hp_pemohon")}
          />
          {errors.no_hp_pemohon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.no_hp_pemohon.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Email (Pemohon) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Masukkan alamat email"
            className={`${inputClass} ${
              errors.email_pemohon ? "border-red-500" : ""
            }`}
            {...register("email_pemohon")}
          />
          {errors.email_pemohon && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email_pemohon.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Jabatan</label>
          <input
            type="text"
            placeholder="Masukkan jabatan"
            className={inputClass}
            {...register("jabatan_pemohon")}
          />
        </div>
      </div>
    </section>
  );
}
