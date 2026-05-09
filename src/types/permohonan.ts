export interface StatusInfo {
  id: number;
  name: string;
  description: string | null;
}

export interface PermohonanRow {
  id: string;
  application_number: string | null;
  created_at: string;
  status_id: number;
  status_name: string;
  nama_pemohon: string | null;
  nama_perusahaan: string | null;
}

export interface PermohonanDetail {
  id: string;
  application_number: string | null;
  created_at: string;
  status_id: number;
  status_name: string;
  revision_notes: string | null;
  ncage_code: string | null;
  documents: Record<string, string> | null;

  submission_date: string | null;
  application_type: string | null;
  ncage_request_type: string | null;
  purpose: string | null;
  entity_type: string | null;
  building_ownership_status: string | null;
  is_ahu_registered: boolean | null;
  office_coordinate: string | null;
  nib: string | null;
  npwp: string | null;
  business_field: string | null;

  nama_pemohon: string | null;
  identity_number: string | null;
  address: string | null;
  phone_number: string | null;
  email_pemohon: string | null;
  position: string | null;

  nama_perusahaan: string | null;
  province: string | null;
  city: string | null;
  street: string | null;
  postal_code: string | null;
  po_box: string | null;
  phone_kantor: string | null;
  fax: string | null;
  email_kantor: string | null;
  website: string | null;
  affiliate: string | null;

  products: string | null;
  production_capacity: string | null;
  number_of_employees: string | null;
  branch_office_name: string | null;
  branch_office_street: string | null;
  branch_office_city: string | null;
  branch_office_postal_code: string | null;
  affiliate_company: string | null;
  affiliate_company_street: string | null;
  affiliate_company_city: string | null;
  affiliate_company_postal_code: string | null;
}

export const DOCUMENT_LABELS: Record<string, string> = {
  surat_permohonan: "Surat Permohonan",
  surat_pernyataan: "Surat Pernyataan",
  foto_kantor: "Foto Kantor",
  sk_domisili: "SK Domisili",
  akta_notaris: "Akta Notaris",
  sk_kemenkumham: "SK Kemenkumham",
  siup_nib: "SIUP / NIB",
  company_profile: "Company Profile",
  npwp_perusahaan: "NPWP Perusahaan",
  surat_kuasa: "Surat Kuasa",
  daftar_isian_sam: "Daftar Isian SAM",
};
