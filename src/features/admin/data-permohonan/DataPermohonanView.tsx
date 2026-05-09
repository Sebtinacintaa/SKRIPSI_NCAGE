import { DataTablePermohonan } from "@/src/components/admin/DataTablePermohonan";
import type { PermohonanRow } from "@/src/types/permohonan";

interface DataPermohonanViewProps {
  data: PermohonanRow[];
}

export default function DataPermohonanView({ data }: DataPermohonanViewProps) {
  return (
    <div className="p-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight">Data Permohonan NCAGE</h1>
        <p className="text-[14px] text-gray-500 mt-2.5 font-normal leading-relaxed">
          Kelola dan verifikasi permohonan NCAGE yang masuk dari perusahaan secara sistematis.
        </p>
      </div>
      <DataTablePermohonan data={data} />
    </div>
  );
}
