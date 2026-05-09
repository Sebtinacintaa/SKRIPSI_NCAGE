"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateStatusPermohonan } from "@/src/services/admin/permohonanService";
import type { PermohonanDetail } from "@/src/types/permohonan";
import { DOCUMENT_LABELS } from "@/src/types/permohonan";

const statusConfig: Record<
  number,
  { label: string; className: string; icon: string }
> = {
  1: {
    label: "Permohonan Dikirim",
    className: "bg-gray-100 text-gray-600",
    icon: "ri-send-plane-line",
  },
  2: {
    label: "Verifikasi Berkas & Data",
    className: "bg-amber-100 text-amber-700",
    icon: "ri-loader-4-line",
  },
  3: {
    label: "Butuh Perbaikan",
    className: "bg-orange-100 text-orange-700",
    icon: "ri-error-warning-line",
  },
  4: {
    label: "Sertifikat Diterbitkan",
    className: "bg-emerald-100 text-emerald-700",
    icon: "ri-checkbox-circle-line",
  },
  5: {
    label: "Permohonan Ditolak",
    className: "bg-red-100 text-red-600",
    icon: "ri-close-circle-line",
  },
};

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[15px] border border-gray-100/40 shadow-sm shadow-gray-100/40 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100/40 bg-gray-50/30">
        <h2 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-[14px] text-gray-800 font-medium">
        {value || <span className="text-gray-300 font-normal">—</span>}
      </p>
    </div>
  );
}

function ConfirmModal({
  type,
  isPending,
  onCancel,
  onConfirm,
  catatanRevisi,
  onCatatanChange,
}: {
  type: "acc" | "tolak" | "revisi" | null;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: (catatan?: string) => void;
  catatanRevisi: string;
  onCatatanChange: (v: string) => void;
}) {
  if (!type) return null;

  const config = {
    acc: {
      icon: "ri-checkbox-circle-fill text-emerald-500",
      iconBg: "bg-emerald-50",
      title: "Setujui & Terbitkan Sertifikat?",
      desc: (
        <>
          Permohonan ini akan disetujui dan status berubah ke{" "}
          <strong className="text-emerald-700">Sertifikat Diterbitkan</strong>.
        </>
      ),
      confirmLabel: "Ya, Terbitkan",
      confirmClass: "bg-emerald-600 hover:bg-emerald-700",
    },
    tolak: {
      icon: "ri-close-circle-fill text-red-500",
      iconBg: "bg-red-50",
      title: "Tolak Permohonan?",
      desc: "Permohonan ini akan ditolak secara final. Tindakan ini tidak dapat dibatalkan.",
      confirmLabel: "Ya, Tolak",
      confirmClass: "bg-red-600 hover:bg-red-700",
    },
    revisi: {
      icon: "ri-edit-2-fill text-orange-500",
      iconBg: "bg-orange-50",
      title: "Minta Revisi",
      desc: "Tuliskan catatan revisi yang perlu diperbaiki oleh pemohon.",
      confirmLabel: "Kirim Revisi",
      confirmClass: "bg-orange-600 hover:bg-orange-500 shadow-sm shadow-orange-600/10",
    },
  }[type];

  const isRevisi = type === "revisi";
  const disableConfirm = isPending || (isRevisi && !catatanRevisi.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 transition-opacity animate-in fade-in duration-300"
        onClick={onCancel}
      />
      <div className="relative bg-white border border-gray-100/40 rounded-[15px] shadow-xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300 z-20">
        <div
          className={`w-14 h-14 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <i className={`${config.icon} text-3xl`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          {config.title}
        </h3>
        <p className="text-[13px] text-gray-500 text-center leading-relaxed mb-4">
          {config.desc}
        </p>

        {isRevisi && (
          <textarea
            value={catatanRevisi}
            onChange={(e) => onCatatanChange(e.target.value)}
            placeholder="Contoh: Dokumen NPWP tidak terbaca, harap upload ulang dengan resolusi lebih tinggi"
            rows={4}
            className="w-full px-4 py-2.5 text-[13px] font-medium border border-gray-300 rounded-[15px] bg-white text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/60 transition-all resize-none mb-4"
          />
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-[15px] border border-gray-300 text-gray-700 text-[13px] font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Batal
          </button>
          <button
            onClick={() => onConfirm(isRevisi ? catatanRevisi : undefined)}
            disabled={disableConfirm}
            className={`flex-1 py-3 px-4 rounded-[15px] text-white text-[13px] font-semibold transition-all duration-200 disabled:opacity-50 ${config.confirmClass}`}
          >
            {isPending ? "Memproses..." : config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NcageInfo {
  code: string;
  issued_at: string | null;
  expires_at: string | null;
}

export function DetailPermohonanClient({
  data,
  backUrl = "/admin/data-permohonan",
  backLabel = "Data Permohonan",
  ncageInfo,
}: {
  data: PermohonanDetail;
  backUrl?: string;
  backLabel?: string;
  ncageInfo?: NcageInfo;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeModal, setActiveModal] = useState<
    "acc" | "tolak" | "revisi" | null
  >(null);
  const [catatanRevisi, setCatatanRevisi] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<string>("");

  const statusCfg = statusConfig[data.status_id] ?? statusConfig[1];
  const isFinal = data.status_id === 4 || data.status_id === 5;

  const docList = Object.entries(DOCUMENT_LABELS).map(([key, label]) => {
    const signedUrl = data.documents?.[key] || null;
    return { key, label, url: signedUrl };
  });
  const availableDocs = docList.filter((d) => d.url !== null);

  const handleConfirm = (catatan?: string) => {
    const statusMap = { acc: 4, tolak: 5, revisi: 3 } as const;
    const statusId = statusMap[activeModal!] as 3 | 4 | 5;

    startTransition(async () => {
      const result = await updateStatusPermohonan(data.id, statusId, catatan);
      if (result.success) {
        router.refresh();
      } else {
        alert("Gagal memperbarui status: " + result.message);
      }
      setActiveModal(null);
      setCatatanRevisi("");
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <ConfirmModal
        type={activeModal}
        isPending={isPending}
        onCancel={() => {
          setActiveModal(null);
          setCatatanRevisi("");
        }}
        onConfirm={handleConfirm}
        catatanRevisi={catatanRevisi}
        onCatatanChange={setCatatanRevisi}
      />

      <div className="gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-2">
            <Link
              href={backUrl}
              className="hover:text-[#8B1E1E] transition-colors"
            >
              {backLabel}
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-gray-600 font-medium truncate max-w-[220px]">
              {data.id}
            </span>
          </div>
          <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight">
            Detail NCAGE — {data.nama_perusahaan ?? "—"}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-3 mt-5">
          {!ncageInfo && !isFinal && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveModal("tolak")}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[15px] border border-red-100/50 bg-red-50/60 text-red-700 text-[13px] font-semibold hover:bg-red-100/80 active:scale-95 transition-all disabled:opacity-50"
              >
                <i className="ri-close-circle-line" />
                Tolak
              </button>
              <button
                onClick={() => setActiveModal("revisi")}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[15px] border border-orange-100/60 bg-orange-50/50 text-orange-700 text-[13px] font-semibold hover:bg-orange-100/80 active:scale-95 transition-all disabled:opacity-50"
              >
                <i className="ri-edit-2-line" />
                Minta Revisi
              </button>
              <button
                onClick={() => setActiveModal("acc")}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[15px] bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-600/20 disabled:opacity-50"
              >
                <i className="ri-checkbox-circle-line" />
                Setuju & Terbitkan
              </button>
            </div>
          )}

          <button
            onClick={() => router.push(backUrl)}
            className="flex ml-auto items-center gap-2 px-4 py-2.5 rounded-[15px] bg-[#8B1E1E] text-white text-[13px] font-semibold hover:bg-[#6e1818] active:scale-95 transition-all shadow-sm shadow-[#8B1E1E]/20"
          >
            <i className="ri-arrow-left-line" />
            Kembali
          </button>
        </div>
      </div>

      {/* NCAGE Record info — only shown when viewing from ncage-records */}
      {ncageInfo && (
        <SectionCard title="Kode NCAGE Diterbitkan">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5">
            <div className="flex flex-col gap-1">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Kode NCAGE</p>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-bold w-fit tracking-widest border border-emerald-100">
                <i className="ri-shield-check-line" />
                {ncageInfo.code || "—"}
              </span>
            </div>
            <Field
              label="Tanggal Terbit"
              value={
                ncageInfo.issued_at
                  ? new Date(ncageInfo.issued_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : null
              }
            />
            <Field
              label="Tanggal Kadaluarsa"
              value={
                ncageInfo.expires_at
                  ? new Date(ncageInfo.expires_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : null
              }
            />
          </div>
        </SectionCard>
      )}

      <SectionCard title="Status Permohonan">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Nama Pemohon" value={data.nama_pemohon} />
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Status
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold w-fit ${statusCfg.className}`}
            >
              <i className={statusCfg.icon} />
              {statusCfg.label}
            </span>
          </div>
          <Field
            label="Tanggal Pengajuan"
            value={
              data.created_at
                ? new Date(data.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : null
            }
          />
          {data.revision_notes && (
            <div className="col-span-2 p-4 bg-orange-50/40 border border-orange-100/50 rounded-[15px]">
              <p className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1.5">
                <i className="ri-edit-2-line mr-1" />
                Catatan Revisi
              </p>
              <p className="text-[13px] text-orange-900 leading-relaxed">
                {data.revision_notes}
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Dokumen Terlampir">
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {docList.map((doc) => (
              <div
                key={doc.key}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[15px] border text-[13px] font-medium transition-all ${
                  doc.url
                    ? "border-emerald-100 bg-emerald-50/30 text-emerald-700"
                    : "border-gray-100/30 bg-gray-50/30 text-gray-400"
                }`}
              >
                <i
                  className={`${doc.url ? "ri-file-check-line" : "ri-file-line"} text-base shrink-0`}
                />
                <span className="truncate">{doc.label}</span>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors"
                    title="Lihat dokumen"
                  >
                    <i className="ri-external-link-line text-sm" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100/40">
            <p className="text-[12px] font-semibold text-gray-500 mb-2">
              Preview Dokumen
            </p>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-4 py-2.5 text-[13px] font-medium border border-gray-200/50 rounded-[15px] bg-white text-gray-600 focus:outline-none focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E]/40 transition-all mb-3"
            >
              <option value="">— Pilih dokumen —</option>
              {availableDocs.map((doc) => (
                <option key={doc.key} value={doc.url ?? ""}>
                  {doc.label}
                </option>
              ))}
            </select>
            {selectedDoc ? (
              <iframe
                src={selectedDoc}
                className="w-full h-[480px] rounded-[15px] border border-gray-200/50 bg-gray-50/30"
                title="Preview Dokumen"
              />
            ) : (
              <div className="w-full h-28 rounded-[15px] border border-dashed border-gray-200/50 bg-gray-50/30 flex items-center justify-center">
                <p className="text-[13px] text-gray-400">
                  Belum ada dokumen yang dipilih.
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="A. Identifikasi Entitas">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
          <Field
            label="Tanggal Pengajuan (Form)"
            value={
              data.submission_date
                ? new Date(data.submission_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : null
            }
          />
          <Field label="Jenis Permohonan" value={data.application_type} />
          <div />
          <Field
            label="Jenis Permohonan NCAGE"
            value={data.ncage_request_type}
          />
          <Field label="Tujuan Penerbitan" value={data.purpose} />
          <Field label="Tipe Entitas" value={data.entity_type} />
          <Field
            label="Status Kepemilikan Bangunan"
            value={data.building_ownership_status}
          />
          <Field
            label="AHU Terdaftar"
            value={
              data.is_ahu_registered === null
                ? null
                : data.is_ahu_registered
                  ? "Ya"
                  : "Tidak"
            }
          />
          <Field label="Koordinat Kantor" value={data.office_coordinate} />
          <Field label="NIB" value={data.nib} />
          <Field label="NPWP" value={data.npwp} />
          <Field label="Bidang Usaha" value={data.business_field} />
        </div>
      </SectionCard>

      <SectionCard title="B. Narahubung">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
          <Field label="Nama" value={data.nama_pemohon} />
          <Field label="Nomor Identitas" value={data.identity_number} />
          <Field label="Alamat" value={data.address} />
          <Field label="Nomor Telepon" value={data.phone_number} />
          <Field label="Email" value={data.email_pemohon} />
          <Field label="Jabatan" value={data.position} />
        </div>
      </SectionCard>

      <SectionCard title="C. Detail Badan Usaha">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
          <Field label="Nama Perusahaan" value={data.nama_perusahaan} />
          <Field label="Provinsi" value={data.province} />
          <Field label="Kota" value={data.city} />
          <Field label="Jalan" value={data.street} />
          <Field label="Kode Pos" value={data.postal_code} />
          <Field label="PO Box" value={data.po_box} />
          <Field label="Nomor Telepon" value={data.phone_kantor} />
          <Field label="Fax" value={data.fax} />
          <Field label="Email" value={data.email_kantor} />
          <Field label="Website" value={data.website} />
          <Field label="Perusahaan Afiliasi" value={data.affiliate} />
        </div>
      </SectionCard>

      <SectionCard title="D. Informasi Lainnya">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
          <Field label="Produk" value={data.products} />
          <Field label="Kapasitas Produksi" value={data.production_capacity} />
          <Field label="Jumlah Karyawan" value={data.number_of_employees} />
          <Field label="Nama Cabang" value={data.branch_office_name} />
          <Field label="Jalan Cabang" value={data.branch_office_street} />
          <Field label="Kota Cabang" value={data.branch_office_city} />
          <Field
            label="Kode Pos Cabang"
            value={data.branch_office_postal_code}
          />
          <Field label="Perusahaan Afiliasi" value={data.affiliate_company} />
          <Field
            label="Jalan Perusahaan Afiliasi"
            value={data.affiliate_company_street}
          />
          <Field
            label="Kota Perusahaan Afiliasi"
            value={data.affiliate_company_city}
          />
          <Field
            label="Kode Pos Perusahaan Afiliasi"
            value={data.affiliate_company_postal_code}
          />
        </div>
      </SectionCard>
    </div>
  );
}
