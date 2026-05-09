import React from "react";
import { useFormContext } from "react-hook-form";
import type { NcageRegistrationFormValues } from "@/src/schema";


function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
    <div className="sm:w-1/3 text-sm text-gray-500 font-medium">{label}</div>
    <div className="sm:w-2/3 text-sm text-gray-900 font-semibold flex gap-2">
      <span className="hidden sm:inline">:</span> {value || "-"}
    </div>
  </div>
);

export default function Step3Review() {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<NcageRegistrationFormValues>();
  const formValues = watch();

  const documentRequirements = [
    { name: "surat_permohonan", label: "Surat Permohonan NCAGE *" },
    { name: "surat_pernyataan", label: "Surat Pernyataan Kebenaran Data *" },
    { name: "foto_kantor", label: "Foto Kantor (Dengan GPS Map Camera) *" },
    { name: "sk_domisili", label: "SK Domisili" },
    { name: "akta_notaris", label: "Akta Notaris *" },
    { name: "sk_kemenkumham", label: "SK Kemenkumham *" },
    { name: "siup_nib", label: "SIUP/NIB (Nomor Induk Berusaha) *" },
    { name: "company_profile", label: "Company Profile Perusahaan *" },
    { name: "npwp_perusahaan", label: "NPWP Perusahaan *" },
    { name: "surat_kuasa", label: "Surat Kuasa" },
    { name: "daftar_isian_sam", label: "Daftar Isian SAM.GOV" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Box Header yang lebih minimalis */}
      <div className="bg-[#FBFBFB] px-8 pt-12 pb-10 rounded-t-3xl border border-gray-100 flex flex-col items-center text-center">
        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Review & Konfirmasi
        </h3>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Silakan periksa kembali data dan berkas yang telah Anda unggah sebelum mengirim.
        </p>
      </div>

      <div className="border border-gray-100 border-t-0 rounded-b-3xl p-8 md:p-12 bg-white shadow-sm space-y-16">
        
        {/* ================================
            SECTION 1: REVIEW BERKAS
        ================================ */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
            <h4 className="text-lg font-bold text-gray-800">Detail Dokumen</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {documentRequirements.map((doc, idx) => {
              const file = formValues[
                doc.name as keyof NcageRegistrationFormValues
              ] as File | undefined | null;

              if (!file) {
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-400 ml-1">
                      {doc.label}
                    </label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl">
                       <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300">
                         <i className="ri-file-line text-xl"></i>
                       </div>
                       <span className="text-sm text-gray-400 font-medium italic">Berkas belum tersedia</span>
                    </div>
                  </div>
                );
              }

              const handlePreview = () => {
                if (file) {
                  const url = URL.createObjectURL(file);
                  window.open(url, "_blank");
                }
              };

              return (
                <div key={idx} className="flex flex-col gap-1.5 group">
                  <label className="text-xs font-semibold text-gray-500 ml-1">
                    {doc.label}
                  </label>
                  <div 
                    onClick={handlePreview}
                    className="flex items-center justify-between p-4 bg-[#F2FAF5] border border-[#E1F2E8] rounded-2xl hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 cursor-pointer group/card"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#E1F2E8] shrink-0 shadow-sm group-hover/card:scale-105 transition-transform">
                        <i className="ri-file-pdf-2-fill text-2xl text-red-500"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate pr-2">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] text-gray-500 font-medium uppercase">
                             {formatBytes(file.size)}
                           </span>
                           <span className="w-1 h-1 bg-emerald-200 rounded-full"></span>
                           <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                             <i className="ri-checkbox-circle-fill"></i>
                             Berhasil diunggah
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover/card:text-emerald-600 transition-colors">
                      <i className="ri-eye-line text-lg"></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================
            SECTION 2: REVIEW FORMULIR
        ================================ */}
        <div className="space-y-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
            <h4 className="text-lg font-bold text-gray-800">Detail Data</h4>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">
                a. Identifikasi Entitas
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <ReviewRow
                label="Tanggal Pengajuan"
                value={formValues.tanggal_pengajuan || ""}
              />
              <ReviewRow
                label="Jenis Permohonan"
                value={formValues.jenis_permohonan || ""}
              />
              <ReviewRow
                label="Jenis Permohonan NCAGE"
                value={formValues.jenis_ncage || ""}
              />
              <ReviewRow
                label="Tujuan Penerbitan NCAGE"
                value={formValues.tujuan_penerbitan || ""}
              />
              <ReviewRow
                label="Tipe Entitas"
                value={formValues.tipe_entitas || ""}
              />
              <ReviewRow
                label="Status Kepemilikan Bangunan"
                value={formValues.status_kepemilikan || ""}
              />
              <ReviewRow
                label="Terdaftar (AHU.Online)"
                value={formValues.is_ahu_registered || ""}
              />
              <ReviewRow
                label="Koordinat Kantor"
                value={formValues.koordinat_kantor || ""}
              />
              <ReviewRow label="NIB" value={formValues.nib || ""} />
              <ReviewRow label="NPWP" value={formValues.npwp || ""} />
              <ReviewRow
                label="Bidang Usaha"
                value={formValues.bidang_usaha || ""}
              />
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">b. Contact Person</h3>
            </div>
            <div className="p-6 space-y-4">
              <ReviewRow
                label="Nama Pemohon"
                value={formValues.nama_pemohon || ""}
              />
              <ReviewRow
                label="Nomor Identitas"
                value={formValues.nomor_identitas || ""}
              />
              <ReviewRow
                label="Alamat"
                value={formValues.alamat_pemohon || ""}
              />
              <ReviewRow
                label="Nomor telepon / HP"
                value={formValues.no_hp_pemohon || ""}
              />
              <ReviewRow label="Email" value={formValues.email_pemohon || ""} />
              <ReviewRow
                label="Jabatan"
                value={formValues.jabatan_pemohon || ""}
              />
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">c. Detail Badan Usaha</h3>
            </div>
            <div className="p-6 space-y-4">
              <ReviewRow
                label="Nama Badan Usaha"
                value={formValues.nama_badan_usaha || ""}
              />
              <ReviewRow label="Provinsi" value={formValues.provinsi || ""} />
              <ReviewRow label="Kota" value={formValues.kota || ""} />
              <ReviewRow
                label="Alamat Kantor"
                value={formValues.alamat_kantor || ""}
              />
              <ReviewRow label="Kode Pos" value={formValues.kode_pos || ""} />
              <ReviewRow label="PO.Box" value={formValues.po_box || ""} />
              <ReviewRow
                label="No. Telepon (Kantor)"
                value={formValues.no_telepon_kantor || ""}
              />
              <ReviewRow
                label="No. FAX (Kantor)"
                value={formValues.no_fax_kantor || ""}
              />
              <ReviewRow
                label="Email (Kantor)"
                value={formValues.email_kantor || ""}
              />
              <ReviewRow
                label="Website (Kantor)"
                value={formValues.website_kantor || ""}
              />
              <ReviewRow
                label="Perusahaan Afiliasi"
                value={formValues.perusahaan_afiliasi || ""}
              />
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">d. Informasi Lainnya</h3>
            </div>
            <div className="p-6 space-y-4">
              <ReviewRow
                label="Produk Yang Dihasilkan"
                value={formValues.produk_dihasilkan || ""}
              />
              <ReviewRow
                label="Kemampuan Produksi"
                value={formValues.kemampuan_produksi || ""}
              />
              <ReviewRow
                label="Jumlah Karyawan"
                value={formValues.jumlah_karyawan || ""}
              />

              <div className="pt-4 mt-2">
                <h4 className="font-semibold text-red-700 mb-4 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>{" "}
                  Kantor Cabang
                </h4>
                <div className="pl-4 space-y-4">
                  <ReviewRow
                    label="Nama Kantor Cabang"
                    value={formValues.kantor_cabang || ""}
                  />
                  <ReviewRow
                    label="Nama Jalan"
                    value={formValues.jalan_cabang || ""}
                  />
                  <ReviewRow
                    label="Kota"
                    value={formValues.kota_cabang || ""}
                  />
                  <ReviewRow
                    label="Kode Pos"
                    value={formValues.kode_pos_cabang || ""}
                  />
                </div>
              </div>

              <div className="pt-4 mt-2">
                <h4 className="font-semibold text-red-700 mb-4 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>{" "}
                  Perusahaan Afiliasi
                </h4>
                <div className="pl-4 space-y-4">
                  <ReviewRow
                    label="Nama Perusahaan Afiliasi"
                    value={formValues.perusahaan_afiliasi_info || ""}
                  />
                  <ReviewRow
                    label="Nama Jalan"
                    value={formValues.jalan_afiliasi || ""}
                  />
                  <ReviewRow
                    label="Kota"
                    value={formValues.kota_afiliasi || ""}
                  />
                  <ReviewRow
                    label="Kode Pos"
                    value={formValues.kode_pos_afiliasi || ""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================
            CHECKBOX PERNYATAAN
        ================================ */}
        <div className="mt-8">
          <div className="p-5 border border-gray-200 rounded-xl bg-gray-50">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 accent-[#8a1515] rounded border-gray-300 cursor-pointer"
                {...register("is_agreed")}
              />
              <span className="text-sm text-gray-700 leading-relaxed font-medium">
                Saya menyatakan data dan dokumen yang diunggah sudah benar dan
                dapat dipertanggung jawabkan
              </span>
            </label>
          </div>
          {errors.is_agreed && (
            <p className="mt-2 text-sm text-red-500 font-medium">
              {errors.is_agreed.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
