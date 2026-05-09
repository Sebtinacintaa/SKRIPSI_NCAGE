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
