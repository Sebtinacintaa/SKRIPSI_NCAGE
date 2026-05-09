"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";

export type NcageExpiryResult =
  | { found: false }
  | { found: true; daysLeft: number; expiryDateFormatted: string };

/**
 * Cek apakah ncage record milik aplikasi ini akan/sudah kadaluarsa.
 * Dipanggil dari client component — logika adminClient dijalankan di server.
 */
export async function checkNcageExpiry(
  applicationId: string,
): Promise<NcageExpiryResult> {
  const adminSupabase = createAdminClient();

  const { data: ncageRec } = await adminSupabase
    .from("ncage_records")
    .select("expires_at")
    .eq("ncage_application_id", applicationId)
    .maybeSingle();

  if (!ncageRec?.expires_at) {
    return { found: false };
  }

  const now = new Date();
  const expiresAt = new Date(ncageRec.expires_at);
  const daysLeft = Math.ceil(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  const expiryDateFormatted = expiresAt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return { found: true, daysLeft, expiryDateFormatted };
}

/**
 * Generate nomor permohonan dengan format: NCG + DDMMYYYY + urutan harian
 * Contoh: NCG100520261 (permohonan pertama pada tanggal 10 Mei 2026)
 */
export async function generateApplicationNumber(): Promise<string> {
  const adminSupabase = createAdminClient();
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = String(now.getFullYear());
  const dateStr = `${dd}${mm}${yyyy}`; // DDMMYYYY

  // Hitung berapa permohonan yang sudah ada hari ini
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).toISOString();
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  ).toISOString();

  const { count } = await adminSupabase
    .from("ncage_applications")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfDay)
    .lt("created_at", endOfDay);

  const seq = (count ?? 0) + 1;
  return `NCG${dateStr}${seq}`;
}
