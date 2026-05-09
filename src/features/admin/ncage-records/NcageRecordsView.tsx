import { DataTableNcageRecords } from "@/src/components/admin/DataTableNcageRecords";
import type { NcageRecord } from "@/src/data/fake-db/admin/NcageRecords";

interface NcageRecordsViewProps {
  data: NcageRecord[];
}

export default function NcageRecordsView({ data }: NcageRecordsViewProps) {
  return (
    <div className="p-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight">NCAGE Records</h1>
        <p className="text-[14px] text-gray-500 mt-2.5 font-normal leading-relaxed">
          Rekap seluruh kode NCAGE yang telah diterbitkan beserta statusnya secara sistematis.
        </p>
      </div>
      <DataTableNcageRecords data={data} />
    </div>
  );
}
