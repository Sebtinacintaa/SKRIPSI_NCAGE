import { createAdminClient } from "@/src/utils/supabase/admin";
import DashboardView from "@/src/features/admin/dashboard/DashboardView";

const STATUS_CONFIG: Record<number, { name: string; color: string }> = {
  1: { name: "Permohonan Dikirim", color: "#3B82F6" },
  2: { name: "Dalam Verifikasi", color: "#F59E0B" },
  3: { name: "Butuh Perbaikan", color: "#F97316" },
  4: { name: "Sertifikat Diterbitkan", color: "#10B981" },
  5: { name: "Ditolak", color: "#EF4444" },
};

const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];

async function getDashboardData(viewMode: string, selectedYear: number) {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { count: todayApplications } = await supabase
    .from("ncage_applications").select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`).lte("created_at", `${today}T23:59:59`);

  const { data: ncageStatusRows } = await supabase
    .from("ncage_records").select("ncagesd, expires_at, ncage_application_id");

  const now = new Date();
  const activeSet = new Set<string>();
  let activeNcage = 0;
  let inactiveNcage = 0;

  (ncageStatusRows || []).forEach((row) => {
    const isActive = row.expires_at ? new Date(row.expires_at) > now : false;
    if (isActive) { activeNcage += 1; if (row.ncage_application_id) activeSet.add(row.ncage_application_id); return; }
    inactiveNcage += 1;
  });

  const { data: allApps } = await supabase.from("ncage_applications").select("status_id");
  const statusCount: Record<number, number> = {};
  (allApps || []).forEach((app) => { const sid = app.status_id as number; statusCount[sid] = (statusCount[sid] || 0) + 1; });
  const statusDistribution = Object.entries(STATUS_CONFIG).map(([id, cfg]) => ({ name: cfg.name, value: statusCount[Number(id)] || 0, color: cfg.color })).filter((s) => s.value > 0);

  const { data: allAppsDate } = await supabase.from("ncage_applications").select("created_at");
  let registrationTrend: { label: string; count: number }[] = [];

  if (viewMode === "yearly") {
    const currentYear = new Date().getFullYear();
    const yearCount: Record<number, number> = {};
    (allAppsDate || []).forEach((app) => { const year = new Date(app.created_at).getFullYear(); yearCount[year] = (yearCount[year] || 0) + 1; });
    for (let y = 2023; y <= currentYear; y++) registrationTrend.push({ label: String(y), count: yearCount[y] || 0 });
  } else {
    const monthCount: Record<number, number> = {};
    (allAppsDate || []).forEach((app) => { const d = new Date(app.created_at); if (d.getFullYear() === selectedYear) { const m = d.getMonth(); monthCount[m] = (monthCount[m] || 0) + 1; } });
    registrationTrend = MONTHS.map((label, i) => ({ label, count: monthCount[i] || 0 }));
  }

  const { data: provinceData } = await supabase.from("company_details").select("province, ncage_application_id");
  const provinceCount: Record<string, number> = {};
  (provinceData || []).forEach((row) => { if (row.province && activeSet.has(row.ncage_application_id)) { provinceCount[row.province] = (provinceCount[row.province] || 0) + 1; } });
  const provinceDistribution = Object.entries(provinceCount).map(([province, count]) => ({ province, count }));

  return { todayApplications: todayApplications || 0, activeNcage: activeNcage || 0, inactiveNcage: inactiveNcage || 0, statusDistribution, registrationTrend, provinceDistribution };
}

export default async function DashboardAdminPage({ searchParams }: { searchParams: Promise<{ view?: string; year?: string }> }) {
  const params = await searchParams;
  const viewMode = params.view === "monthly" ? "monthly" : "yearly";
  const selectedYear = Number(params.year) || new Date().getFullYear();
  const data = await getDashboardData(viewMode, selectedYear);
  return <DashboardView data={data} />;
}
