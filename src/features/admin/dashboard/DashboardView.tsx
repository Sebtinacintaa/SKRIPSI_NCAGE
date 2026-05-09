import { Suspense } from "react";
import DashboardClient from "@/src/components/admin/DashboardClient";

type DashboardData = {
  todayApplications: number;
  activeNcage: number;
  inactiveNcage: number;
  statusDistribution: { name: string; value: number; color: string }[];
  registrationTrend: { label: string; count: number }[];
  provinceDistribution: { province: string; count: number }[];
};

interface DashboardViewProps {
  data: DashboardData;
}

export default function DashboardView({ data }: DashboardViewProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-[#8B1E1E]/20 border-t-[#8B1E1E] rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardClient data={data} />
    </Suspense>
  );
}
