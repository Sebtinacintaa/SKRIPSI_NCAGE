"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { generateCertificate } from "@/src/utils/certificate";
import { createNotification } from "@/src/lib/notifications";

function generateRandomNCAGE(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ncage = "";
  for (let i = 0; i < 5; i++) {
    ncage += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ncage;
}

export async function updateStatusPermohonan(
  applicationId: string,
  statusId: 3 | 4 | 5,
  catatanRevisi?: string,
) {
  const supabase = createAdminClient();

  const updatePayload: Record<string, unknown> = {
    status_id: statusId,
    updated_at: new Date().toISOString(),
  };

  if (statusId === 3 && catatanRevisi) {
    updatePayload.revision_notes = catatanRevisi;
  }

  if (statusId === 4) {
    const { data: appData, error: appError } = await supabase
      .from("ncage_applications")
      .select(
        `
        user_id,
        ncage_code,
        company_details (
          name, street, city, province, postal_code, phone, email, website
        ),
        application_identities (
          entity_type
        )
      `,
      )
      .eq("id", applicationId)
      .single();

    if (appError || !appData) {
      console.error("Gagal mengambil data aplikasi:", appError);
      return {
        success: false,
        message: "Gagal memuat data perusahaan untuk sertifikat.",
      };
    }

    const company = Array.isArray(appData.company_details)
      ? appData.company_details[0]
      : appData.company_details;

    const ncageCode = appData.ncage_code || generateRandomNCAGE();
    updatePayload.ncage_code = ncageCode;

    try {
      const certBuffer = await generateCertificate({
        ncage_code: ncageCode,
        entity_name: company?.name || "-",
        street: company?.street || "-",
        city: company?.city || "-",
        stt: company?.province || "-",
        psc: company?.postal_code || "-",
        tel: company?.phone || "-",
        ema: company?.email || "-",
        www: company?.website || "-",
      });

      const certFilename = `Sertifikat_NCAGE_${ncageCode}_${Date.now()}.docx`;
      const certPath = `${appData.user_id}/certificates/${certFilename}`;

      const { error: uploadError } = await supabase.storage
        .from("ncage_documents")
        .upload(certPath, certBuffer, {
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

      if (uploadError) {
        console.error("Gagal mengunggah sertifikat:", uploadError);
        return { success: false, message: "Gagal menyimpan file sertifikat." };
      }

      updatePayload.domestic_certificate_path = certPath;
    } catch (e) {
      console.error("Error saat men-generate sertifikat:", e);
      return {
        success: false,
        message: "Terjadi kesalahan saat memproses sertifikat (docx).",
      };
    }
  }

  const { error } = await supabase
    .from("ncage_applications")
    .update(updatePayload)
    .eq("id", applicationId);

  if (error) {
    console.error("[updateStatusPermohonan] Error:", error.message);
    return { success: false, message: error.message };
  }

  const { data: appMeta } = await supabase
    .from("ncage_applications")
    .select(
      `
      user_id,
      ncage_code,
      company_details ( name, street, city, province, postal_code, phone, email, website ),
      application_identities ( entity_type )
    `,
    )
    .eq("id", applicationId)
    .single();

  const userId = appMeta?.user_id;

  if (statusId === 3 && userId) {
    await createNotification({
      user_id: userId,
      type: "warning",
      title: "Permohonan Butuh Perbaikan",
      description: catatanRevisi
        ? `Permohonan NCAGE Anda memerlukan perbaikan. Catatan dari admin: ${catatanRevisi}`
        : "Permohonan NCAGE Anda memerlukan perbaikan. Silakan cek catatan revisi di halaman Pantau Status.",
      related_application_id: applicationId,
    });
  }

  if (statusId === 4 && userId) {
    const ncageCode = updatePayload.ncage_code as string;

    if (appMeta) {
      const company = Array.isArray(appMeta.company_details)
        ? appMeta.company_details[0]
        : appMeta.company_details;
      const identity = Array.isArray(appMeta.application_identities)
        ? appMeta.application_identities[0]
        : appMeta.application_identities;

      // Cek apakah record sudah ada (kasus renewal — ncage_code tetap sama)
      const { data: existingRecord } = await supabase
        .from("ncage_records")
        .select("id")
        .eq("ncage_application_id", applicationId)
        .maybeSingle();

      if (existingRecord) {
        // UPDATE — hanya update dokumen, tanggal terbit, dan data perusahaan
        // ncage_code TIDAK diubah agar selalu sama
        const { error: updateError } = await supabase
          .from("ncage_records")
          .update({
            entity_name: company?.name || "-",
            street: company?.street || "-",
            city: company?.city || "-",
            stt: company?.province || "-",
            psc: company?.postal_code || "-",
            tel: company?.phone || "-",
            ema: company?.email || "-",
            www: company?.website || "-",
            toec: identity?.entity_type || "-",
            domestic_certificate_path:
              updatePayload.domestic_certificate_path || null,
            issued_at: new Date().toISOString(),
          })
          .eq("ncage_application_id", applicationId);

        if (updateError) {
          console.error("Gagal update ncage_records:", updateError.message);
          return {
            success: false,
            message: "Gagal memperbarui ncage_records: " + updateError.message,
          };
        }
      } else {
        // INSERT — pendaftaran pertama kali
        const { error: insertError } = await supabase
          .from("ncage_records")
          .insert({
            ncage_application_id: applicationId,
            ncage_code: ncageCode || appMeta.ncage_code,
            entity_name: company?.name || "-",
            street: company?.street || "-",
            city: company?.city || "-",
            stt: company?.province || "-",
            psc: company?.postal_code || "-",
            tel: company?.phone || "-",
            ema: company?.email || "-",
            www: company?.website || "-",
            toec: identity?.entity_type || "-",
            domestic_certificate_path:
              updatePayload.domestic_certificate_path || null,
            ncagesd: "A",
            issued_at: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Gagal insert ke ncage_records:", insertError.message);
          return {
            success: false,
            message: "Gagal menyimpan ke ncage_records: " + insertError.message,
          };
        }
      }

    }

    await createNotification({
      user_id: userId,
      type: "success",
      title: "Sertifikat NCAGE Diterbitkan",
      description: `Selamat! Permohonan NCAGE Anda telah disetujui dan kode NCAGE ${ncageCode || ""} telah diterbitkan. Sertifikat dapat diunduh di halaman Pantau Status.`,
      related_application_id: applicationId,
    });
  }

  if (statusId === 5 && userId) {
    await createNotification({
      user_id: userId,
      type: "warning",
      title: "Permohonan NCAGE Ditolak",
      description:
        "Permohonan NCAGE Anda telah ditolak. Silakan hubungi tim Puskod Kemhan untuk informasi lebih lanjut.",
      related_application_id: applicationId,
    });
  }

  revalidatePath("/admin/data-permohonan");
  revalidatePath(`/admin/data-permohonan/${applicationId}`);
  revalidatePath("/admin/ncage-records");

  return { success: true };
}
