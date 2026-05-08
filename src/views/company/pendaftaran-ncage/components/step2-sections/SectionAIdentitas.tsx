import React from "react";
import { useFormContext } from "react-hook-form";
import type { NcageRegistrationFormValues } from "@/src/schema";

export default function SectionAIdentitas() {
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
          <label className={labelClass}>Tanggal Pengajuan</label>
          <input
            type="date"
            className={inputClass}
            {...register("tanggal_pengajuan")}
          />
        </div>

        <div>
          <label className={labelClass}>
            Jenis Permohonan <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Perorangan"
                className="accent-[#8a1515]"
                {...register("jenis_permohonan")}
              />{" "}
              Perorangan
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Perusahaan / Kelompok"
                className="accent-[#8a1515]"
                {...register("jenis_permohonan")}
              />{" "}
              Perusahaan / Kelompok
            </label>
          </div>
          {errors.jenis_permohonan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jenis_permohonan.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Jenis Permohonan NCAGE <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Permohonan Baru"
                className="accent-[#8a1515]"
                {...register("jenis_ncage")}
              />{" "}
              Permohonan Baru
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Perbaharui Data / Update"
                className="accent-[#8a1515]"
                {...register("jenis_ncage")}
              />{" "}
              Perbaharui Data / Update
            </label>
          </div>
          {errors.jenis_ncage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.jenis_ncage.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Tujuan Penerbitan NCAGE <span className="text-red-500">*</span>
          </label>
          <select
            className={`${inputClass} ${
              errors.tujuan_penerbitan ? "border-red-500" : ""
            }`}
            {...register("tujuan_penerbitan")}
          >
            <option value="">Pilih tujuan penerbitan NCAGE</option>
            <option value="Keperluan Ekspor">Keperluan Ekspor</option>
            <option value="Tender Internasional">Tender Internasional</option>
          </select>
          {errors.tujuan_penerbitan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tujuan_penerbitan.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Tipe Entitas <span className="text-red-500">*</span>
          </label>
          <select
            className={`${inputClass} ${
              errors.tipe_entitas ? "border-red-500" : ""
            }`}
            {...register("tipe_entitas")}
          >
            <option value="">Pilih tipe entitas</option>
            <option value="PT (Perseroan Terbatas)">
              PT (Perseroan Terbatas)
            </option>
            <option value="CV">CV</option>
          </select>
          {errors.tipe_entitas && (
            <p className="text-red-500 text-sm mt-1">
              {errors.tipe_entitas.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Status Kepemilikan Bangunan <span className="text-red-500">*</span>
          </label>
          <select
            className={`${inputClass} ${
              errors.status_kepemilikan ? "border-red-500" : ""
            }`}
            {...register("status_kepemilikan")}
          >
            <option value="">Pilih status kepemilikan bangunan</option>
            <option value="Milik Sendiri">Milik Sendiri</option>
            <option value="Sewa">Sewa</option>
          </select>
          {errors.status_kepemilikan && (
            <p className="text-red-500 text-sm mt-1">
              {errors.status_kepemilikan.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Terdaftar (AHU.Online) <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Sudah"
                className="accent-[#8a1515]"
                {...register("is_ahu_registered")}
              />{" "}
              Sudah
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                value="Belum"
                className="accent-[#8a1515]"
                {...register("is_ahu_registered")}
              />{" "}
              Belum
            </label>
          </div>
          {errors.is_ahu_registered && (
            <p className="text-red-500 text-sm mt-1">
              {errors.is_ahu_registered.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Koordinat Kantor (GPS Map) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan titik koordinat kantor"
            className={`${inputClass} ${
              errors.koordinat_kantor ? "border-red-500" : ""
            }`}
            {...register("koordinat_kantor")}
          />
          {errors.koordinat_kantor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.koordinat_kantor.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            NIB (Nomor Induk Berusaha) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan NIB"
            className={`${inputClass} ${errors.nib ? "border-red-500" : ""}`}
            {...register("nib")}
          />
          {errors.nib && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nib.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            NPWP (Nomor Pokok Wajib Pajak){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan NPWP"
            className={`${inputClass} ${errors.npwp ? "border-red-500" : ""}`}
            {...register("npwp")}
          />
          {errors.npwp && (
            <p className="text-red-500 text-sm mt-1">
              {errors.npwp.message?.toString()}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>
            Bidang Usaha <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan jenis bidang usaha"
            className={`${inputClass} ${
              errors.bidang_usaha ? "border-red-500" : ""
            }`}
            {...register("bidang_usaha")}
          />
          {errors.bidang_usaha && (
            <p className="text-red-500 text-sm mt-1">
              {errors.bidang_usaha.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
