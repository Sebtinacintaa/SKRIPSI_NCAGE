"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart";

const PROVINCE_MAP: Record<string, string> = {
  Aceh: "Aceh",
  "North Sumatra": "Sumatera Utara",
  "West Sumatra": "Sumatera Barat",
  Riau: "Riau",
  "Riau Islands": "Kepulauan Riau",
  Jambi: "Jambi",
  "South Sumatra": "Sumatera Selatan",
  Bengkulu: "Bengkulu",
  Lampung: "Lampung",
  "Bangka Belitung Islands": "Kepulauan Bangka Belitung",
  Jakarta: "DKI Jakarta",
  "West Java": "Jawa Barat",
  Banten: "Banten",
  "Central Java": "Jawa Tengah",
  Yogyakarta: "DI Yogyakarta",
  "East Java": "Jawa Timur",
  Bali: "Bali",
  "West Nusa Tenggara": "Nusa Tenggara Barat",
  "East Nusa Tenggara": "Nusa Tenggara Timur",
  "West Kalimantan": "Kalimantan Barat",
  "Central Kalimantan": "Kalimantan Tengah",
  "South Kalimantan": "Kalimantan Selatan",
  "East Kalimantan": "Kalimantan Timur",
  "North Kalimantan": "Kalimantan Utara",
  "North Sulawesi": "Sulawesi Utara",
  Gorontalo: "Gorontalo",
  "Central Sulawesi": "Sulawesi Tengah",
  "West Sulawesi": "Sulawesi Barat",
  "South Sulawesi": "Sulawesi Selatan",
  "Southeast Sulawesi": "Sulawesi Tenggara",
  "North Maluku": "Maluku Utara",
  Maluku: "Maluku",
  "West Papua": "Papua Barat",
  Papua: "Papua",
};

const GEO_URL =
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-en.geojson";

interface DashboardData {
  todayApplications: number;
  activeNcage: number;
  inactiveNcage: number;
  statusDistribution: { name: string; value: number; color: string }[];
  registrationTrend: { label: string; count: number }[];
  provinceDistribution: { province: string; count: number }[];
}
interface Props {
  data: DashboardData;
}

function AnimatedCounter({
  target,
  duration = 1800,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    const start = performance.now();
    const raf = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 4)) * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return <span>{count.toLocaleString("id-ID")}</span>;
}

function StatRadialCard({
  label,
  value,
  total,
  color,
  icon,
  bgClass,
  iconColor,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: string;
  bgClass: string;
  iconColor: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const chartData = [{ name: label, value: pct, fill: color }];
  const chartConfig: ChartConfig = {
    value: { label, color },
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100/40 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:scale-[1.01] transition-all duration-300 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-800 leading-none">
            <AnimatedCounter target={value} />
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${bgClass} flex items-center justify-center`}
        >
          <i className={`${icon} ${iconColor} text-xl`} />
        </div>
      </div>

      <p className="text-[11px] text-gray-400 font-medium mt-6">
        <span className="font-semibold" style={{ color }}>
          {pct}%
        </span>{" "}
        dari total permohonan
      </p>
    </div>
  );
}

type GeoTooltip = { name: string; count: number; x: number; y: number };

function IndonesiaMap({
  provinceCountMap,
  maxCount,
}: {
  provinceCountMap: Record<string, number>;
  maxCount: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<GeoTooltip | null>(null);
  const [geoData, setGeoData] = useState<any | null>(null);

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then(setGeoData)
      .catch(console.error);
  }, []);

  const getFill = (count: number) => {
    if (count === 0) return "#90913d";
    const t = count / Math.max(maxCount, 1);
    if (t >= 0.75) return "#7F1D1D";
    if (t >= 0.5) return "#B91C1C";
    if (t >= 0.25) return "#EF4444";
    return "#FCA5A5";
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: 400,
        background: "linear-gradient(160deg,#dbeafe 0%,#eff6ff 100%)",
      }}
    >
      {tooltip && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 56 }}
        >
          <div className="bg-gray-900 text-white rounded-xl px-3.5 py-2.5 shadow-2xl min-w-[130px]">
            <p className="font-bold text-[13px]">{tooltip.name}</p>
            <p className="text-[11px] text-emerald-300 font-semibold mt-0.5">
              {tooltip.count} perusahaan NCAGE
            </p>
          </div>
          <div className="ml-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900" />
        </div>
      )}

      {!geoData ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#8B1E1E]/20 border-t-[#8B1E1E] rounded-full animate-spin" />
        </div>
      ) : (
        /* Render SVG map using path projection from geojson */
        <IndonesiaSVGMap
          geoData={geoData}
          provinceCountMap={provinceCountMap}
          getFill={getFill}
          onHover={(name, count, x, y) => setTooltip({ name, count, x, y })}
          onLeave={() => setTooltip(null)}
          containerRef={containerRef}
          hoveredName={tooltip?.name ?? null}
        />
      )}
    </div>
  );
}

function IndonesiaSVGMap({
  geoData,
  provinceCountMap,
  getFill,
  onHover,
  onLeave,
  containerRef,
  hoveredName,
}: {
  geoData: any;
  provinceCountMap: Record<string, number>;
  getFill: (n: number) => string;
  onHover: (name: string, count: number, x: number, y: number) => void;
  onLeave: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredName: string | null;
}) {
  const W = 900,
    H = 400;
  const lonMin = 95,
    lonMax = 141,
    latMin = -11,
    latMax = 6;
  const scaleX = W / (lonMax - lonMin);
  const scaleY = H / (latMax - latMin);

  function project([lon, lat]: number[]) {
    return [(lon - lonMin) * scaleX, (latMax - lat) * scaleY];
  }

  function coordsToPath(coords: number[][][]): string {
    return coords
      .map(
        (ring) =>
          ring
            .map((pt, i) => {
              const [x, y] = project(pt);
              return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ") + " Z",
      )
      .join(" ");
  }

  function featureToPath(feature: any): string {
    const geom = feature.geometry;
    if (geom.type === "Polygon")
      return coordsToPath(geom.coordinates as number[][][]);
    if (geom.type === "MultiPolygon")
      return (geom.coordinates as number[][][][])
        .map((poly) => coordsToPath(poly))
        .join(" ");
    return "";
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      {geoData.features.map((feature: any, i: number) => {
        const rawName: string =
          (feature.properties as Record<string, string>)?.state ||
          (feature.properties as Record<string, string>)?.name ||
          "";
        const dbName = PROVINCE_MAP[rawName] ?? rawName;
        const count = provinceCountMap[dbName] ?? 0;
        const isHovered = hoveredName === dbName;
        const d = featureToPath(feature);
        if (!d) return null;
        return (
          <path
            key={i}
            d={d}
            fill={isHovered ? "#F59E0B" : getFill(count)}
            stroke="#fff"
            strokeWidth={0.5}
            style={{ transition: "fill 0.12s ease", cursor: "pointer" }}
            onMouseEnter={(e) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect)
                onHover(
                  dbName || rawName,
                  count,
                  e.clientX - rect.left,
                  e.clientY - rect.top,
                );
            }}
            onMouseMove={(e) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect)
                onHover(
                  dbName || rawName,
                  count,
                  e.clientX - rect.left,
                  e.clientY - rect.top,
                );
            }}
            onMouseLeave={onLeave}
          />
        );
      })}
    </svg>
  );
}

export default function DashboardClient({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2022 }, (_, i) => 2023 + i);
  const viewMode = (searchParams.get("view") || "yearly") as
    | "yearly"
    | "monthly";
  const selectedYear = Number(searchParams.get("year")) || currentYear;

  const setViewMode = (mode: "yearly" | "monthly") => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("view", mode);
    startTransition(() => router.push(`?${p.toString()}`));
  };
  const setSelectedYear = (year: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("year", String(year));
    startTransition(() => router.push(`?${p.toString()}`));
  };

  const totalApps = data.statusDistribution.reduce((s, d) => s + d.value, 0);

  // Province
  const provinceCountMap = Object.fromEntries(
    data.provinceDistribution.map((p) => [p.province, p.count]),
  );
  const maxCount = Math.max(
    ...data.provinceDistribution.map((p) => p.count),
    1,
  );
  const top5 = [...data.provinceDistribution]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const pieConfig: ChartConfig = Object.fromEntries(
    data.statusDistribution.map((s) => [
      s.name,
      { label: s.name, color: s.color },
    ]),
  );

  const areaConfig: ChartConfig = {
    count: { label: "Pendaftaran", color: "#8B1E1E" },
  };

  return (
    <div className="p-8 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-[28px] font-semibold text-gray-800 tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-[14px] text-gray-500 mt-2 font-normal leading-relaxed">
          Selamat datang kembali! Kelola data permohonan dan pendaftaran NCAGE
          secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatRadialCard
          label="Pendaftaran Hari Ini"
          value={data.todayApplications}
          total={totalApps}
          color="#3B82F6"
          icon="ri-file-add-line"
          bgClass="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatRadialCard
          label="NCAGE Aktif"
          value={data.activeNcage}
          total={totalApps}
          color="#10B981"
          icon="ri-shield-check-line"
          bgClass="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatRadialCard
          label="NCAGE Tidak Aktif"
          value={data.inactiveNcage}
          total={totalApps}
          color="#EF4444"
          icon="ri-shield-cross-line"
          bgClass="bg-red-50"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100/40 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-gray-800 mb-0.5">
              Status Permohonan
            </h2>
            <p className="text-[11px] text-gray-400 mb-4">
              Distribusi berdasarkan status
            </p>
            <ChartContainer
              config={pieConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      hideLabel
                      formatter={(value, name) => (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-700">
                            {name}
                          </span>
                          <span className="font-extrabold text-[#8B1E1E] ml-auto">
                            {value}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                <Pie
                  data={data.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  strokeWidth={0}
                  animationBegin={100}
                  animationDuration={1200}
                >
                  {data.statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-5 border-t border-gray-100/40 pt-4">
            {data.statusDistribution.map((entry, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[11px] font-medium text-gray-500 leading-tight">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100/40 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-[14px] font-bold text-gray-800">
                Tren Pendaftaran NCAGE
              </h2>
              <p className="text-[11px] text-gray-400">
                Jumlah pendaftaran dari waktu ke waktu
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-0.5 text-[11px] font-bold">
                <button
                  onClick={() => setViewMode("yearly")}
                  className={`px-3 py-1.5 rounded-md transition-all ${viewMode === "yearly" ? "bg-white text-[#8B1E1E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Per Tahun
                </button>
                <button
                  onClick={() => setViewMode("monthly")}
                  className={`px-3 py-1.5 rounded-md transition-all ${viewMode === "monthly" ? "bg-white text-[#8B1E1E] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Per Bulan
                </button>
              </div>
              {viewMode === "monthly" && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="text-[11px] font-bold border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <ChartContainer config={areaConfig} className="h-[240px] w-full mt-8">
            <AreaChart
              data={data.registrationTrend}
              margin={{ top: 20, right: 8, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B1E1E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#8B1E1E" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fontWeight: 600, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 600, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#8B1E1E"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: "#8B1E1E", strokeWidth: 0, r: 3.5 }}
                activeDot={{
                  r: 6,
                  fill: "#8B1E1E",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                animationDuration={1400}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100/40 shadow-sm p-6">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-[14px] font-bold text-gray-800">
              Persebaran Perusahaan Pemegang Kode NCAGE
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Per provinsi, berdasarkan kode NCAGE aktif
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-500 flex-wrap">
            {[
              { label: "Tidak ada", color: "#90913d", border: true },
              { label: "Rendah", color: "#FCA5A5" },
              { label: "Sedang", color: "#EF4444" },
              { label: "Tinggi", color: "#B91C1C" },
              { label: "Tertinggi", color: "#7F1D1D" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className={`w-3.5 h-3.5 rounded shrink-0 ${item.border ? "border border-gray-300" : ""}`}
                  style={{ background: item.color }}
                />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <IndonesiaMap provinceCountMap={provinceCountMap} maxCount={maxCount} />
        {top5.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Top Provinsi
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {top5.map((p, idx) => (
                <div
                  key={p.province}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100"
                >
                  <span className="text-[11px] font-extrabold text-[#8B1E1E] w-4 shrink-0">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-gray-700 truncate leading-tight">
                      {p.province.replace("DKI ", "").replace("DI ", "")}
                    </p>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {p.count} perusahaan
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
