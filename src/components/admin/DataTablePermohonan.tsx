"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import type { PermohonanRow } from "@/src/types/permohonan";

const statusConfig: Record<number, { label: string; className: string }> = {
  1: {
    label: "Permohonan Dikirim",
    className: "bg-gray-100 text-gray-600",
  },
  2: {
    label: "Verifikasi Berkas & Data",
    className: "bg-amber-100 text-amber-700",
  },
  3: {
    label: "Butuh Perbaikan",
    className: "bg-orange-100 text-orange-700",
  },
  4: {
    label: "Sertifikat Diterbitkan",
    className: "bg-emerald-100 text-emerald-700",
  },
  5: {
    label: "Permohonan Ditolak",
    className: "bg-red-100 text-red-600",
  },
};

const STATUS_OPTIONS = Object.entries(statusConfig).map(([id, cfg]) => ({
  id: Number(id),
  label: cfg.label,
}));

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface DataTablePermohonanProps {
  data: PermohonanRow[];
}

export function DataTablePermohonan({ data }: DataTablePermohonanProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columns: ColumnDef<PermohonanRow>[] = [
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => (
        <button
          onClick={() =>
            router.push(`/admin/data-permohonan/${row.original.id}`)
          }
          title="Lihat Detail"
          className="
            w-8 h-8 rounded-lg flex items-center justify-center
            bg-sky-500 hover:bg-sky-600 active:scale-95
            transition-all shadow-sm shadow-sky-500/30
          "
        >
          <i className="ri-eye-line text-white text-[15px]" />
        </button>
      ),
      enableSorting: false,
    },

    {
      accessorKey: "application_number",
      header: "No. Permohonan",
      cell: ({ row }) => {
        const num = row.getValue("application_number") as string | null;
        return num ? (
          <span className="font-bold tracking-wider font-mono text-[12px] text-[#8B1E1E]">
            {num}
          </span>
        ) : (
          <span className="text-gray-300 text-[12px] italic">—</span>
        );
      },
    },

    {
      accessorKey: "nama_pemohon",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1.5 font-semibold hover:text-[#8B1E1E] transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Pemohon
          <i
            className={`text-[11px] ${
              column.getIsSorted() === "asc"
                ? "ri-arrow-up-s-line text-[#8B1E1E]"
                : column.getIsSorted() === "desc"
                  ? "ri-arrow-down-s-line text-[#8B1E1E]"
                  : "ri-arrow-up-down-line text-gray-400"
            }`}
          />
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-800">
          {row.getValue("nama_pemohon") ?? (
            <span className="text-gray-400 italic">—</span>
          )}
        </span>
      ),
    },

    {
      accessorKey: "nama_perusahaan",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1.5 font-semibold hover:text-[#8B1E1E] transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Perusahaan
          <i
            className={`text-[11px] ${
              column.getIsSorted() === "asc"
                ? "ri-arrow-up-s-line text-[#8B1E1E]"
                : column.getIsSorted() === "desc"
                  ? "ri-arrow-down-s-line text-[#8B1E1E]"
                  : "ri-arrow-up-down-line text-gray-400"
            }`}
          />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-gray-600">
          {row.getValue("nama_perusahaan") ?? (
            <span className="text-gray-400 italic">—</span>
          )}
        </span>
      ),
    },

    {
      accessorKey: "status_id",
      header: "Status",
      cell: ({ row }) => {
        const statusId = row.getValue("status_id") as number;
        const config = statusConfig[statusId] ?? {
          label: "Tidak Diketahui",
          className: "bg-gray-100 text-gray-500",
        };
        return (
          <span
            className={`
              inline-flex items-center px-2.5 py-1 rounded-full
              text-[11px] font-semibold whitespace-nowrap
              ${config.className}
            `}
          >
            {config.label}
          </span>
        );
      },
      filterFn: (row, _columnId, filterValue) => {
        if (!filterValue) return true;
        return row.original.status_id === Number(filterValue);
      },
    },

    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <button
          className="flex items-center gap-1.5 font-semibold hover:text-[#8B1E1E] transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Pengajuan
          <i
            className={`text-[11px] ${
              column.getIsSorted() === "asc"
                ? "ri-arrow-up-s-line text-[#8B1E1E]"
                : column.getIsSorted() === "desc"
                  ? "ri-arrow-down-s-line text-[#8B1E1E]"
                  : "ri-arrow-up-down-line text-gray-400"
            }`}
          />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-gray-500 text-[13px]">
          {formatDate(row.getValue("created_at"))}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="flex flex-col gap-5 mt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]" />
          <input
            type="text"
            placeholder="Cari pemohon / perusahaan..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="
              w-full pl-9.5 pr-4 py-2.5 text-[13px] font-medium border border-gray-200/50 rounded-[10px]
              bg-white text-gray-700 placeholder:text-gray-400/80 placeholder:font-normal
              focus:outline-none focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E]/40
              transition-all
            "
          />
        </div>

        <select
          onChange={(e) =>
            table
              .getColumn("status_id")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="
            px-4 py-2.5 text-[13px] font-medium border border-gray-200/50 rounded-[10px]
            bg-white text-gray-600 focus:outline-none
            focus:ring-4 focus:ring-[#8B1E1E]/5 focus:border-[#8B1E1E]/40
            transition-all cursor-pointer
          "
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-[15px] border border-gray-100/40 overflow-hidden bg-white shadow-sm shadow-gray-100/40">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-50/80 hover:bg-gray-50/80 border-b border-gray-100"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-[12px] text-gray-500 font-semibold uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3.5 text-[13px]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center text-gray-400 text-sm"
                >
                  <i className="ri-inbox-line text-3xl block mb-2 text-gray-300" />
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>
          Menampilkan{" "}
          <strong className="text-gray-700">
            {table.getFilteredRowModel().rows.length === 0
              ? 0
              : table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1}
          </strong>{" "}
          –{" "}
          <strong className="text-gray-700">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}
          </strong>{" "}
          dari{" "}
          <strong className="text-gray-700">
            {table.getFilteredRowModel().rows.length}
          </strong>{" "}
          data
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-skip-left-line text-lg" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-arrow-left-s-line text-lg" />
          </button>

          <span className="px-3 py-1 rounded-lg bg-[#8B1E1E] text-white text-[12px] font-bold">
            {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount() || 1}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-arrow-right-s-line text-lg" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <i className="ri-skip-right-line text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}
