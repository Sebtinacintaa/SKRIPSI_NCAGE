import Link from "next/link";
import { DownloadCertificateButton } from "@/src/components/company/DownloadCertificateButton";

const statusConfig: Record<number, { label: string; bgClass: string; textClass: string; icon: string }> = {
  1: { label: "Permohonan Dikirim", bgClass: "bg-gray-100", textClass: "text-gray-700", icon: "ri-send-plane-line" },
  2: { label: "Verifikasi Berkas & Data", bgClass: "bg-[#FFF3CD]", textClass: "text-[#856404]", icon: "ri-loader-4-line" },
  3: { label: "Butuh Perbaikan", bgClass: "bg-orange-100", textClass: "text-orange-700", icon: "ri-error-warning-line" },
  4: { label: "Sertifikat Diterbitkan", bgClass: "bg-emerald-100", textClass: "text-emerald-700", icon: "ri-checkbox-circle-line" },
  5: { label: "Permohonan Ditolak", bgClass: "bg-red-100", textClass: "text-red-700", icon: "ri-close-circle-line" },
};

type ApplicationData = {
  id: string;
  created_at?: string | null;
  status_id?: number | null;
  ncage_code?: string | null;
  revision_notes?: string | null;
  application_number?: string | null;
  application_identities?: {
    application_type?: string | null;
    ncage_request_type?: string | null;
    purpose?: string | null;
    entity_type?: string | null;
  } | null;
};

type NcageRecInfo = { expires_at: string; ncage_code: string | null } | null;

interface PantauStatusViewProps {
  data: ApplicationData | null;
  domesticCertificateUrl: string | null;
  ncageRecInfo: NcageRecInfo;
  ncageDaysLeft: number | null;
}

export default function PantauStatusView({ data, domesticCertificateUrl, ncageRecInfo, ncageDaysLeft }: PantauStatusViewProps) {
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight mb-8">Pantau Status Pengajuan</h1>
        <div className="bg-white rounded-3xl border border-gray-100/50 p-12 text-center shadow-xl shadow-gray-200/30 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 hover:scale-110 shadow-inner">
            <i className="ri-inbox-line text-4xl"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Belum Ada Pengajuan</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">Anda belum melakukan pendaftaran NCAGE. Silakan ajukan permohonan baru melalui menu Pendaftaran NCAGE.</p>
          <Link href="/pendaftaran-ncage" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#8C1E1E] hover:bg-[#721818] text-white font-semibold rounded-xl transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#8C1E1E]/20">
            Mulai Pendaftaran
          </Link>
        </div>
      </div>
    );
  }

  const identity = Array.isArray(data.application_identities)
    ? (data.application_identities as NonNullable<ApplicationData["application_identities"]>[])[0]
    : data.application_identities;
  const statusId = data.status_id ?? 1;
  const cfg = statusConfig[statusId] || statusConfig[1];

  const gridRow = "grid grid-cols-1 md:grid-cols-[200px_auto_1fr] gap-2 md:gap-4 items-start md:items-center py-5";

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight mb-8">Pantau Status Pengajuan</h1>
      <div className="bg-white rounded-3xl border border-gray-100/50 p-8 md:p-10 shadow-xl shadow-gray-200/30 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex flex-col divide-y divide-gray-100/60">
          <div className={`${gridRow} first:pt-0`}>
            <span className="text-gray-500 font-medium text-[15px]">{data.application_number ? "No. Permohonan" : "ID Permohonan"}</span>
            <span className="hidden md:block text-gray-300">:</span>
            {data.application_number
              ? <span className="font-bold tracking-widest font-mono text-[15px] text-[#8C1E1E]">{data.application_number}</span>
              : <span className="text-gray-500 font-mono text-[13px] break-all">{data.id}</span>}
          </div>
          <div className={gridRow}>
            <span className="text-gray-500 font-medium text-[15px]">Tanggal Pengajuan</span>
            <span className="hidden md:block text-gray-300">:</span>
            <span className="text-gray-800 font-semibold text-[15px]">
              {data.created_at ? new Date(data.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}
            </span>
          </div>
          <div className={gridRow}>
            <span className="text-gray-500 font-medium text-[15px]">Jenis Permohonan</span>
            <span className="hidden md:block text-gray-300">:</span>
            <span className="text-gray-800 font-semibold text-[15px]">{identity?.application_type ?? "-"}</span>
          </div>
          <div className={gridRow}>
            <span className="text-gray-500 font-medium text-[15px]">Jenis Permohonan NCAGE</span>
            <span className="hidden md:block text-gray-300">:</span>
            <span className="text-gray-800 font-semibold text-[15px]">{identity?.ncage_request_type ?? "-"}</span>
          </div>
          <div className={gridRow}>
            <span className="text-gray-500 font-medium text-[15px]">Tujuan Penerbitan NCAGE</span>
            <span className="hidden md:block text-gray-300">:</span>
            <span className="text-gray-800 font-semibold text-[15px]">{identity?.purpose ?? "-"}</span>
          </div>
          <div className={gridRow}>
            <span className="text-gray-500 font-medium text-[15px]">Tipe Entitas</span>
            <span className="hidden md:block text-gray-300">:</span>
            <span className="text-gray-800 font-semibold text-[15px]">{identity?.entity_type ?? "-"}</span>
          </div>
          <div className={`${gridRow} last:pb-0`}>
            <span className="text-gray-500 font-medium text-[15px]">Status Saat Ini</span>
            <span className="hidden md:block text-gray-300">:</span>
            <div className="flex items-center">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide shadow-sm ${cfg.bgClass} ${cfg.textClass}`}>
                <i className={`${cfg.icon} text-base`}></i>{cfg.label}
              </span>
            </div>
          </div>
          {Number(statusId) === 4 && ncageRecInfo && (
            <>
              <div className={gridRow}>
                <span className="text-gray-500 font-medium text-[15px]">Kode NCAGE</span>
                <span className="hidden md:block text-gray-300">:</span>
                <span className="font-bold tracking-widest font-mono text-[15px] text-gray-800">{ncageRecInfo.ncage_code ?? data.ncage_code ?? "-"}</span>
              </div>
              <div className={gridRow}>
                <span className="text-gray-500 font-medium text-[15px]">Status Keaktifan</span>
                <span className="hidden md:block text-gray-300">:</span>
                <div className="flex items-center gap-3">
                  {ncageDaysLeft !== null && ncageDaysLeft > 0
                    ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Aktif</span>
                    : <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-red-100 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Kadaluarsa</span>}
                  {ncageDaysLeft !== null && ncageDaysLeft > 0 && ncageDaysLeft <= 30 && (
                    <span className="text-amber-600 text-[12px] font-medium"><i className="ri-alarm-warning-line mr-1" />{ncageDaysLeft} hari lagi</span>
                  )}
                </div>
              </div>
              <div className={gridRow}>
                <span className="text-gray-500 font-medium text-[15px]">Tanggal Kadaluarsa</span>
                <span className="hidden md:block text-gray-300">:</span>
                <span className={`font-semibold text-[15px] ${ncageDaysLeft !== null && ncageDaysLeft <= 0 ? "text-red-600" : ncageDaysLeft !== null && ncageDaysLeft <= 30 ? "text-amber-600" : "text-gray-800"}`}>
                  {new Date(ncageRecInfo.expires_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                </span>
              </div>
            </>
          )}
          {statusId === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-[200px_auto_1fr] gap-2 md:gap-4 items-start pt-5 pb-2 last:pb-0">
              <span className="text-gray-500 font-medium text-[15px] pt-1">Catatan Revisi</span>
              <span className="hidden md:block text-gray-300 pt-1">:</span>
              <div className="flex flex-col items-start gap-4">
                {data.revision_notes && (
                  <div className="w-full p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-900 text-[14px] leading-relaxed">
                    <i className="ri-error-warning-line mr-2 text-orange-500 text-base"></i>{data.revision_notes}
                  </div>
                )}
                <Link href="/pendaftaran-ncage" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-[13px] font-semibold rounded-xl hover:bg-orange-700 transition-all duration-300 ease-out hover:scale-[1.03] active:scale-[0.98] shadow-sm shadow-orange-600/20">
                  <i className="ri-edit-2-line"></i>Perbaiki Permohonan
                </Link>
              </div>
            </div>
          )}
          {statusId === 4 && domesticCertificateUrl && (
            <div className="grid grid-cols-1 md:grid-cols-[200px_auto_1fr] gap-2 md:gap-4 items-start pt-5 pb-2 last:pb-0">
              <span className="text-gray-500 font-medium text-[15px] pt-1">Dokumen Sertifikat</span>
              <span className="hidden md:block text-gray-300 pt-1">:</span>
              <div className="flex flex-col items-start gap-4">
                <DownloadCertificateButton signedUrl={domesticCertificateUrl} fileName={`sertifikat-ncage-${data.ncage_code ?? data.id}.docx`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
