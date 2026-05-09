import { createAdminClient } from "@/src/utils/supabase/admin";
import NcageRecordsView from "@/src/features/admin/ncage-records/NcageRecordsView";
import type { NcageRecord } from "@/src/data/fake-db/admin/NcageRecords";

type NcageRecordRow = {
  id: string;
  ncage_code: string | null;
  ncagesd: string | null;
  issued_at: string | null;
  expires_at: string | null;
  creation_date: string | null;
  updated_at: string | null;
  domestic_certificate_path: string | null;
  ncage_application_id: string | null;
  ncage_applications: {
    application_number?: string | null;
    company_details: { name: string | null } | { name: string | null }[] | null;
    application_identities: { entity_type: string | null } | { entity_type: string | null }[] | null;
  } | null;
};

async function getNcageRecords(): Promise<NcageRecord[]> {
  const supabase = createAdminClient();
  const now = new Date();

  const { data, error } = await supabase
    .from("ncage_records")
    .select(`id, ncage_code, ncagesd, issued_at, expires_at, creation_date, updated_at, domestic_certificate_path, ncage_application_id,
      ncage_applications ( *, company_details ( name ), application_identities ( entity_type ) )`)
    .order("updated_at", { ascending: false });

  if (error) { console.error("[ncage-records] Gagal fetch data:", error.message); return []; }

  const rows = data as unknown as NcageRecordRow[];
  const pathsToSign = rows.map((r) => r.domestic_certificate_path).filter(Boolean) as string[];
  const signedUrlsMap: Record<string, string> = {};

  if (pathsToSign.length > 0) {
    const { data: signedData } = await supabase.storage.from("ncage_documents").createSignedUrls(pathsToSign, 3600);
    if (signedData) { signedData.forEach((item) => { if (!item.error && item.signedUrl && item.path) signedUrlsMap[item.path] = item.signedUrl; }); }
  }

  return rows.map((row) => {
    const app = row.ncage_applications;
    const companyDetails = Array.isArray(app?.company_details) ? app?.company_details[0] : app?.company_details;
    const appIdentity = Array.isArray(app?.application_identities) ? app?.application_identities[0] : app?.application_identities;
    const issuedAtRaw = row.issued_at ?? row.creation_date ?? row.updated_at;
    const expiresAtRaw = row.expires_at ?? (issuedAtRaw ? new Date(new Date(issuedAtRaw).setFullYear(new Date(issuedAtRaw).getFullYear() + 5)).toISOString() : null);
    const isActive = expiresAtRaw ? new Date(expiresAtRaw) > now : false;
    const sertifikat_url = row.domestic_certificate_path && signedUrlsMap[row.domestic_certificate_path] ? signedUrlsMap[row.domestic_certificate_path] : null;
    return {
      id: row.id,
      kode_ncage: row.ncage_code ?? "-",
      nama_perusahaan: companyDetails?.name ?? "-",
      status_kode: isActive ? "Aktif" : "Tidak Aktif",
      tipe_entitas: appIdentity?.entity_type ?? "-",
      tanggal_terbit: issuedAtRaw ? new Date(issuedAtRaw).toISOString().split("T")[0] : "-",
      tanggal_kadaluarsa: expiresAtRaw ? new Date(expiresAtRaw).toISOString().split("T")[0] : "-",
      permohonan_id: app?.application_number ?? row.ncage_application_id ?? "-",
      sertifikat_url,
    };
  });
}

export default async function NcageRecordsPage() {
  const records = await getNcageRecords();
  return <NcageRecordsView data={records} />;
}
