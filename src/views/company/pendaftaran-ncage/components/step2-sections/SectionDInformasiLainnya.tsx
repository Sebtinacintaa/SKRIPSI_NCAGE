import React from "react";
import { useFormContext } from "react-hook-form";
import type { NcageRegistrationFormValues } from "@/src/schema";

export default function SectionDInformasiLainnya() {
  const { register } = useFormContext<NcageRegistrationFormValues>();

  const inputClass =
    "w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-500 font-medium focus:border-[#8a1515] focus:ring-1 focus:ring-[#8a1515] outline-none transition-all placeholder-gray-300";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <section>
      <div className="space-y-6 mb-10">
        <div>
          <label className={labelClass}>Produk Yang Dihasilkan</label>
          <input
            type="text"
            placeholder="Masukkan produk yang dihasilkan"
            className={inputClass}
            {...register("produk_dihasilkan")}
          />
        </div>
        <div>
          <label className={labelClass}>Kemampuan Produksi</label>
          <input
            type="text"
            placeholder="Masukkan kemampuan produksi"
            className={inputClass}
            {...register("kemampuan_produksi")}
          />
        </div>
        <div>
          <label className={labelClass}>Jumlah Karyawan</label>
          <input
            type="text"
            placeholder="Masukkan jumlah karyawan"
            className={inputClass}
            {...register("jumlah_karyawan")}
          />
        </div>
      </div>

      <h4 className="font-bold text-gray-800 text-center mb-6">
        Kantor Cabang
      </h4>
      <div className="space-y-6 mb-10">
        <div>
          <label className={labelClass}>Kantor Cabang</label>
          <input
            type="text"
            placeholder="Masukkan kantor cabang"
            className={inputClass}
            {...register("kantor_cabang")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Nama Jalan</label>
            <input
              type="text"
              placeholder="Masukkan nama jalan"
              className={inputClass}
              {...register("jalan_cabang")}
            />
          </div>
          <div>
            <label className={labelClass}>Kota</label>
            <input
              type="text"
              placeholder="Masukkan kota"
              className={inputClass}
              {...register("kota_cabang")}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Kode Pos</label>
          <input
            type="text"
            placeholder="Masukkan kode pos"
            className={inputClass}
            {...register("kode_pos_cabang")}
          />
        </div>
      </div>

      <h4 className="font-bold text-gray-800 text-center mb-6">
        Perusahaan Afiliasi
      </h4>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Perusahaan Afiliasi</label>
          <input
            type="text"
            placeholder="Masukkan perusahaan afiliasi"
            className={inputClass}
            {...register("perusahaan_afiliasi_info")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Nama Jalan</label>
            <input
              type="text"
              placeholder="Masukkan nama jalan"
              className={inputClass}
              {...register("jalan_afiliasi")}
            />
          </div>
          <div>
            <label className={labelClass}>Kota</label>
            <input
              type="text"
              placeholder="Masukkan kota"
              className={inputClass}
              {...register("kota_afiliasi")}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Kode Pos</label>
          <input
            type="text"
            placeholder="Masukkan kode pos"
            className={inputClass}
            {...register("kode_pos_afiliasi")}
          />
        </div>
      </div>
    </section>
  );
}
