import { createAdminClient } from "@/src/utils/supabase/admin";
import { DataTablePermohonan } from "@/src/components/admin/DataTablePermohonan";
import type { PermohonanRow } from "@/src/types/permohonan";

async function getPermohonanList(): Promise<PermohonanRow[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("ncage_applications")
    .select(
      `
      *,
      statuses ( name ),
      application_contacts ( name ),
      company_details ( name )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data-permohonan] Gagal fetch data:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const contact = Array.isArray(row.application_contacts)
      ? row.application_contacts[0]
      : row.application_contacts;
    const company = Array.isArray(row.company_details)
      ? row.company_details[0]
      : row.company_details;
    const status = Array.isArray(row.statuses) ? row.statuses[0] : row.statuses;

    return {
      id: row.id,
      application_number: (row as any).application_number ?? null,
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

  return (
    <div className="p-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight">
          Data Permohonan NCAGE
        </h1>
        <p className="text-[14px] text-gray-500 mt-2.5 font-normal leading-relaxed">
          Kelola dan verifikasi permohonan NCAGE yang masuk dari perusahaan secara sistematis.
        </p>
      </div>

      <DataTablePermohonan data={permohonanList} />
    </div>
  );
}
