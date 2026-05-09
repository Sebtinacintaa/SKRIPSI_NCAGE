import React from "react";
import { useFormContext } from "react-hook-form";
import { PROVINSI, KOTA } from "@/src/utils/dataWilayah";
import type { NcageRegistrationFormValues } from "@/src/schema";

export default function SectionCBadanUsaha() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<NcageRegistrationFormValues>();

  const selectedProvinsi = watch("provinsi");

  const inputClass =
    "w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-500 font-medium focus:border-[#8a1515] focus:ring-1 focus:ring-[#8a1515] outline-none transition-all placeholder-gray-300";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <section>
      <div className="space-y-6">
        <div>
          <label className={labelClass}>
            Nama Badan Usaha <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nama badan usaha"
            className={`${inputClass} ${
              errors.nama_badan_usaha ? "border-red-500" : ""
            }`}
            {...register("nama_badan_usaha")}
          />
          {errors.nama_badan_usaha && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nama_badan_usaha.message?.toString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Provinsi <span className="text-red-500">*</span>
            </label>
            <select
              className={`${inputClass} ${
                errors.provinsi ? "border-red-500" : ""
              }`}
              {...register("provinsi")}
            >
              <option value="">Pilih Provinsi</option>
              {PROVINSI.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.nama}
                </option>
              ))}
            </select>
            {errors.provinsi && (
              <p className="text-red-500 text-sm mt-1">
                {errors.provinsi.message?.toString()}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Kota <span className="text-red-500">*</span>
            </label>
            <select
              className={`${inputClass} ${errors.kota ? "border-red-500" : ""} disabled:bg-gray-100 disabled:cursor-not-allowed`}
              {...register("kota")}
              disabled={!selectedProvinsi}
            >
              <option value="">Pilih Kota</option>
              {selectedProvinsi &&
                KOTA[selectedProvinsi]?.map((kota) => (
                  <option key={kota.id} value={kota.nama}>
                    {kota.nama}
                  </option>
                ))}
            </select>
            {errors.kota && (
              <p className="text-red-500 text-sm mt-1">
                {errors.kota.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Alamat Kantor <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Masukkan alamat kantor"
            className={`${inputClass} ${
              errors.alamat_kantor ? "border-red-500" : ""
            }`}
            {...register("alamat_kantor")}
          />
          {errors.alamat_kantor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.alamat_kantor.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Kode Pos <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan kode pos"
            className={`${inputClass} ${
              errors.kode_pos ? "border-red-500" : ""
            }`}
            {...register("kode_pos")}
          />
          {errors.kode_pos && (
            <p className="text-red-500 text-sm mt-1">
              {errors.kode_pos.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            PO.Box <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan PO.Box"
            className={`${inputClass} ${errors.po_box ? "border-red-500" : ""}`}
            {...register("po_box")}
          />
          {errors.po_box && (
            <p className="text-red-500 text-sm mt-1">
              {errors.po_box.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            No. Telepon (Kantor) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Masukkan nomor telepon"
            className={`${inputClass} ${
              errors.no_telepon_kantor ? "border-red-500" : ""
            }`}
            {...register("no_telepon_kantor")}
          />
          {errors.no_telepon_kantor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.no_telepon_kantor.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>No. FAX (Kantor)</label>
          <input
            type="text"
            placeholder="Masukkan nomor FAX"
            className={inputClass}
            {...register("no_fax_kantor")}
          />
        </div>
        <div>
          <label className={labelClass}>
            Email (Kantor) <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Masukkan alamat email kantor"
            className={`${inputClass} ${
              errors.email_kantor ? "border-red-500" : ""
            }`}
            {...register("email_kantor")}
          />
          {errors.email_kantor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email_kantor.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>Website (Kantor)</label>
          <input
            type="text"
            placeholder="Masukkan website"
            className={inputClass}
            {...register("website_kantor")}
          />
        </div>
        <div>
          <label className={labelClass}>Perusahaan Afiliasi</label>
          <input
            type="text"
            placeholder="Masukkan perusahaan afiliasi"
            className={inputClass}
            {...register("perusahaan_afiliasi")}
          />
        </div>
      </div>
    </section>
  );
}
