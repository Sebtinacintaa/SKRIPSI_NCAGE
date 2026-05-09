import { createClient } from "@/src/utils/supabase/server";
import { createAdminClient } from "@/src/utils/supabase/admin";
import { redirect } from "next/navigation";
import PantauStatusView from "@/src/features/company/pantau-status/PantauStatusView";

// Selalu fetch data fresh — jangan cache halaman ini
export const dynamic = "force-dynamic";

export default async function PantauStatusPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("ncage_applications")
    .select(`*, statuses ( name ), application_identities ( application_type, ncage_request_type, purpose, entity_type )`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) console.error("Gagal fetch data status:", error.message);

  if (!data) {
    return <PantauStatusView data={null} domesticCertificateUrl={null} ncageRecInfo={null} ncageDaysLeft={null} />;
  }

  // Certificate URL resolution
  let domesticCertificateUrl: string | null = null;
  let certificatePath: string | null = data.domestic_certificate_path ?? null;

  if (!certificatePath && Number(data.status_id) === 4) {
    const adminSupabase = createAdminClient();
    const { data: ncageRecord } = await adminSupabase
      .from("ncage_records")
      .select("domestic_certificate_path")
      .eq("ncage_application_id", data.id)
      .maybeSingle();
    certificatePath = ncageRecord?.domestic_certificate_path ?? null;
  }

  if (certificatePath) {
    const { data: signedData, error: signedError } = await supabase.storage
      .from("ncage_documents")
      .createSignedUrl(certificatePath, 3600);
    if (signedData?.signedUrl) {
      domesticCertificateUrl = signedData.signedUrl;
    } else if (signedError) {
      const folderPrefix = certificatePath.split("/").slice(0, -1).join("/");
      const { data: fileList } = await supabase.storage.from("ncage_documents").list(folderPrefix, { limit: 20, sortBy: { column: "created_at", order: "desc" } });
      const certFile = fileList?.find((f) => f.name.endsWith(".docx"));
      if (certFile) {
        const { data: fallbackSigned } = await supabase.storage.from("ncage_documents").createSignedUrl(`${folderPrefix}/${certFile.name}`, 3600);
        if (fallbackSigned?.signedUrl) domesticCertificateUrl = fallbackSigned.signedUrl;
      }
    }
  }

  // NCAGE Record + expiry
  type NcageRecInfo = { expires_at: string; ncage_code: string | null } | null;
  let ncageRecInfo: NcageRecInfo = null;
  let ncageDaysLeft: number | null = null;

  if (Number(data.status_id) === 4) {
    const adminSupabase = createAdminClient();
    const { data: ncageRec } = await adminSupabase
      .from("ncage_records")
      .select("expires_at, ncage_code")
      .eq("ncage_application_id", data.id)
      .maybeSingle();

    if (ncageRec?.expires_at) {
      ncageRecInfo = ncageRec;
      const now = new Date();
      const expiresAt = new Date(ncageRec.expires_at);
      ncageDaysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (ncageDaysLeft <= 30) {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const { data: existingNotif } = await adminSupabase
          .from("notifications").select("id")
          .eq("user_id", user.id).eq("type", "warning").ilike("title", "%kadaluarsa%")
          .gte("created_at", thirtyDaysAgo).maybeSingle();

        if (!existingNotif) {
          const expiryDate = expiresAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
          if (ncageDaysLeft > 0) {
            await adminSupabase.from("notifications").insert({ user_id: user.id, type: "warning", title: `Kode NCAGE Akan Segera Kadaluarsa`, description: `Kode NCAGE ${ncageRec.ncage_code ?? ""} Anda akan kadaluarsa pada ${expiryDate} (${ncageDaysLeft} hari lagi). Segera perbarui dokumen Anda melalui halaman Pendaftaran NCAGE.`, related_application_id: data.id });
          } else {
            await adminSupabase.from("notifications").insert({ user_id: user.id, type: "warning", title: `Kode NCAGE Telah Kadaluarsa`, description: `Kode NCAGE ${ncageRec.ncage_code ?? ""} Anda telah kadaluarsa pada ${expiryDate}. Segera ajukan pembaruan dokumen melalui halaman Pendaftaran NCAGE.`, related_application_id: data.id });
          }
        }
      }
    }
  }

  const identity = Array.isArray(data.application_identities)
    ? data.application_identities[0]
    : data.application_identities;

  return (
    <PantauStatusView
      data={{
        id: data.id,
        created_at: data.created_at ?? null,
        status_id: data.status_id ?? null,
        ncage_code: data.ncage_code ?? null,
        revision_notes: data.revision_notes ?? null,
        application_number: (data as Record<string, unknown>).application_number as string | null ?? null,
        application_identities: identity
          ? {
              application_type: (identity as Record<string, unknown>).application_type as string | null ?? null,
              ncage_request_type: (identity as Record<string, unknown>).ncage_request_type as string | null ?? null,
              purpose: (identity as Record<string, unknown>).purpose as string | null ?? null,
              entity_type: (identity as Record<string, unknown>).entity_type as string | null ?? null,
            }
          : null,
      }}
      domesticCertificateUrl={domesticCertificateUrl}
      ncageRecInfo={ncageRecInfo}
      ncageDaysLeft={ncageDaysLeft}
    />
  );
}
