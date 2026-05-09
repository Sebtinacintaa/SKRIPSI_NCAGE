import { createAdminClient } from "@/src/utils/supabase/admin";
import DataPermohonanView from "@/src/features/admin/data-permohonan/DataPermohonanView";
import type { PermohonanRow } from "@/src/types/permohonan";

async function getPermohonanList(): Promise<PermohonanRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ncage_applications")
    .select(`*, statuses ( name ), application_contacts ( name ), company_details ( name )`)
    .order("created_at", { ascending: false });

  if (error) { console.error("[data-permohonan] Gagal fetch data:", error.message); return []; }

  return (data ?? []).map((row) => {
    const contact = Array.isArray(row.application_contacts) ? row.application_contacts[0] : row.application_contacts;
    const company = Array.isArray(row.company_details) ? row.company_details[0] : row.company_details;
    const status = Array.isArray(row.statuses) ? row.statuses[0] : row.statuses;
    return {
      id: row.id,
      application_number: (row as Record<string, unknown>).application_number as string | null ?? null,
      created_at: row.created_at ?? "",
      status_id: row.status_id ?? 1,
      status_name: status?.name ?? "Permohonan Dikirim",
      nama_pemohon: contact?.name ?? null,
      nama_perusahaan: company?.name ?? null,
    };
  });
}

export default async function DataPermohonanPage() {
  const permohonanList = await getPermohonanList();
  return <DataPermohonanView data={permohonanList} />;
}
