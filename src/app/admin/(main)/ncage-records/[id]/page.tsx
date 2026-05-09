import { notFound } from "next/navigation";
import { createAdminClient } from "@/src/utils/supabase/admin";
import type { PermohonanDetail } from "@/src/types/permohonan";
import { DetailPermohonanClient } from "@/src/app/admin/(main)/data-permohonan/[id]/DetailPermohonanClient";

async function getNcageRecordWithDetail(recordId: string) {
  const supabase = createAdminClient();

  // 1. Get the ncage_record to obtain application_id + NCAGE-specific metadata
  const { data: record, error: recordError } = await supabase
    .from("ncage_records")
    .select("id, ncage_code, ncage_application_id, issued_at, expires_at")
    .eq("id", recordId)
    .single();

  if (recordError || !record?.ncage_application_id) return null;

  const appId = record.ncage_application_id;

  // 2. Fetch the full application detail (same query as data-permohonan)
  const { data, error } = await supabase
    .from("ncage_applications")
    .select(
      `
      id,
      created_at,
      status_id,
      revision_notes,
      ncage_code,
      documents,
      statuses ( name ),
      application_identities (
        submission_date,
        application_type,
        ncage_request_type,
        purpose,
        entity_type,
        building_ownership_status,
        is_ahu_registered,
        office_coordinate,
        nib,
        npwp,
        business_field
      ),
      application_contacts (
        name,
        identity_number,
        address,
        phone_number,
        email,
        position
      ),
      company_details (
        name,
        province,
        city,
        street,
        postal_code,
        po_box,
        phone,
        fax,
        email,
        website,
        affiliate
      ),
      other_informations (
        products,
        production_capacity,
        number_of_employees,
        branch_office_name,
        branch_office_street,
        branch_office_city,
        branch_office_postal_code,
        affiliate_company,
        affiliate_company_street,
        affiliate_company_city,
        affiliate_company_postal_code
      )
    `,
    )
    .eq("id", appId)
    .single();

  if (error || !data) return null;

  const identity = Array.isArray(data.application_identities)
    ? data.application_identities[0]
    : data.application_identities;
  const contact = Array.isArray(data.application_contacts)
    ? data.application_contacts[0]
    : data.application_contacts;
  const company = Array.isArray(data.company_details)
    ? data.company_details[0]
    : data.company_details;
  const other = Array.isArray(data.other_informations)
    ? data.other_informations[0]
    : data.other_informations;
  const status = Array.isArray(data.statuses)
    ? data.statuses[0]
    : data.statuses;

  // 3. Build signed document URLs
  const rawDocuments = (data.documents as Record<string, string>) ?? {};
  const signedDocuments: Record<string, string> = {};
  const paths = Object.values(rawDocuments);
  if (paths.length > 0) {
    const { data: signedData } = await supabase.storage
      .from("ncage_documents")
      .createSignedUrls(paths, 3600);
    if (signedData) {
      const urlMap = new Map(signedData.map((d) => [d.path, d.signedUrl]));
      for (const [key, path] of Object.entries(rawDocuments)) {
        signedDocuments[key] = urlMap.get(path) ?? "";
      }
    }
  }

  const detail: PermohonanDetail = {
    id: data.id,
    created_at: data.created_at ?? "",
    status_id: data.status_id ?? 1,
    status_name: status?.name ?? "Permohonan Dikirim",
    revision_notes: data.revision_notes ?? null,
    ncage_code: data.ncage_code ?? null,
    documents: signedDocuments,

    submission_date: identity?.submission_date ?? null,
    application_type: identity?.application_type ?? null,
    ncage_request_type: identity?.ncage_request_type ?? null,
    purpose: identity?.purpose ?? null,
    entity_type: identity?.entity_type ?? null,
    building_ownership_status: identity?.building_ownership_status ?? null,
    is_ahu_registered: identity?.is_ahu_registered ?? null,
    office_coordinate: identity?.office_coordinate ?? null,
    nib: identity?.nib ?? null,
    npwp: identity?.npwp ?? null,
    business_field: identity?.business_field ?? null,

    nama_pemohon: contact?.name ?? null,
    identity_number: contact?.identity_number ?? null,
    address: contact?.address ?? null,
    phone_number: contact?.phone_number ?? null,
    email_pemohon: contact?.email ?? null,
    position: contact?.position ?? null,

    nama_perusahaan: company?.name ?? null,
    province: company?.province ?? null,
    city: company?.city ?? null,
    street: company?.street ?? null,
    postal_code: company?.postal_code ?? null,
    po_box: company?.po_box ?? null,
    phone_kantor: company?.phone ?? null,
    fax: company?.fax ?? null,
    email_kantor: company?.email ?? null,
    website: company?.website ?? null,
    affiliate: company?.affiliate ?? null,

    products: other?.products ?? null,
    production_capacity: other?.production_capacity ?? null,
    number_of_employees: other?.number_of_employees ?? null,
    branch_office_name: other?.branch_office_name ?? null,
    branch_office_street: other?.branch_office_street ?? null,
    branch_office_city: other?.branch_office_city ?? null,
    branch_office_postal_code: other?.branch_office_postal_code ?? null,
    affiliate_company: other?.affiliate_company ?? null,
    affiliate_company_street: other?.affiliate_company_street ?? null,
    affiliate_company_city: other?.affiliate_company_city ?? null,
    affiliate_company_postal_code: other?.affiliate_company_postal_code ?? null,
  };

  return {
    record: {
      ncage_code: record.ncage_code as string | null,
      issued_at: record.issued_at as string | null,
      expires_at: record.expires_at as string | null,
    },
    detail,
  };
}

export default async function NcageRecordDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getNcageRecordWithDetail(id);

  if (!result) return notFound();

  return (
    <DetailPermohonanClient
      data={result.detail}
      backUrl="/admin/ncage-records"
      backLabel="NCAGE Records"
      ncageInfo={{
        code: result.record.ncage_code ?? "—",
        issued_at: result.record.issued_at,
        expires_at: result.record.expires_at,
      }}
    />
  );
}
