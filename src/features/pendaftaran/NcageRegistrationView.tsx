"use client";

import React, { useState, useEffect } from "react";
import Stepper, { StepItem } from "@/src/components/ui/Stepper";

import { useRouter } from "next/navigation";
import { createClient } from "@/src/utils/supabase/client";
import { checkNcageExpiry, generateApplicationNumber } from "./actions";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ncageRegistrationSchema,
  NcageRegistrationFormValues,
} from "@/src/schema";

import Step1Upload from "./components/Step1Upload";
import SectionAIdentitas from "./components/step2-sections/SectionAIdentitas";
import SectionBContact from "./components/step2-sections/SectionBContact";
import SectionCBadanUsaha from "./components/step2-sections/SectionCBadanUsaha";
import SectionDInformasiLainnya from "./components/step2-sections/SectionDInformasiLainnya";
import Step2Form from "./components/step2-sections/Step2Form";
import Step3Review from "./components/Step3Review";
import SubmissionModal from "@/src/components/company/SubmissionModal";

const STATUS_PERMOHONAN_DIKIRIM = 1;

const FILE_FIELDS = [
  "surat_permohonan",
  "surat_pernyataan",
  "foto_kantor",
  "sk_domisili",
  "akta_notaris",
  "sk_kemenkumham",
  "siup_nib",
  "company_profile",
  "npwp_perusahaan",
  "surat_kuasa",
  "daftar_isian_sam",
] as const;

const NCAGE_STEPS: StepItem[] = [
  { id: 1, label: "Unggah Berkas", icon: "ri-file-upload-line" },
  { id: 2, label: "Isi Formulir", icon: "ri-draft-line" },
  { id: 3, label: "Konfirmasi Kirim", icon: "ri-send-plane-fill" },
];

export default function NcageRegistrationView() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [modalState, setModalState] = useState<
    "closed" | "confirm" | "success" | "already_registered"
  >("closed");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [existingAppId, setExistingAppId] = useState<string | null>(null);
  const [isNearExpiry, setIsNearExpiry] = useState(false);
  const [expiryInfo, setExpiryInfo] = useState<{ daysLeft: number; date: string } | null>(null);

  const methods = useForm<NcageRegistrationFormValues>({
    resolver: zodResolver(ncageRegistrationSchema),
    mode: "onChange",
  });

  const { trigger, handleSubmit, reset } = methods;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("ncage_applications")
            .select(
              `
              id,
              status_id,
              documents,
              application_identities (*),
              application_contacts (*),
              company_details (*),
              other_informations (*)
            `,
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (data) {
            // Jika status = 4 (Sertifikat Diterbitkan), cek apakah H-30 sebelum kadaluarsa
            if (data.status_id === 4) {
              const result = await checkNcageExpiry(data.id);

              if (result.found) {
                const { daysLeft, expiryDateFormatted } = result;

                if (daysLeft <= 30) {
                  // H-30 atau sudah expired → izinkan akses untuk pengiriman ulang berkas
                  setIsNearExpiry(true);
                  setExpiryInfo({ daysLeft, date: expiryDateFormatted });
                } else {
                  // Masih aktif, lebih dari 30 hari → blok
                  setModalState("already_registered");
                  return;
                }
              } else {
                setModalState("already_registered");
                return;
              }
            } else if (data.status_id !== 3) {
              setModalState("already_registered");
              return;
            }

            setExistingAppId(data.id);

            const ident = Array.isArray(data.application_identities)
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
            const docs = (data.documents as Record<string, string>) || {};

            reset({
              ...docs,

              tanggal_pengajuan: ident?.submission_date || "",
              jenis_permohonan: ident?.application_type || "",
              jenis_ncage: ident?.ncage_request_type || "",
              tujuan_penerbitan: ident?.purpose || "",
              tipe_entitas: ident?.entity_type || "",
              status_kepemilikan: ident?.building_ownership_status || "",
              is_ahu_registered: ident?.is_ahu_registered ? "Ya" : "Tidak",
              koordinat_kantor: ident?.office_coordinate || "",
              nib: ident?.nib || "",
              npwp: ident?.npwp || "",
              bidang_usaha: ident?.business_field || "",

              nama_pemohon: contact?.name || "",
              nomor_identitas: contact?.identity_number || "",
              alamat_pemohon: contact?.address || "",
              no_hp_pemohon: contact?.phone_number || "",
              email_pemohon: contact?.email || "",
              jabatan_pemohon: contact?.position || "",

              nama_badan_usaha: company?.name || "",
              provinsi: company?.province || "",
              kota: company?.city || "",
              alamat_kantor: company?.street || "",
              kode_pos: company?.postal_code || "",
              po_box: company?.po_box || "",
              no_telepon_kantor: company?.phone || "",
              no_fax_kantor: company?.fax || "",
              email_kantor: company?.email || "",
              website_kantor: company?.website || "",
              perusahaan_afiliasi: company?.affiliate || "",

              produk_dihasilkan: other?.products || "",
              kemampuan_produksi: other?.production_capacity || "",
              jumlah_karyawan: other?.number_of_employees || "",
              kantor_cabang: other?.branch_office_name || "",
              jalan_cabang: other?.branch_office_street || "",
              kota_cabang: other?.branch_office_city || "",
              kode_pos_cabang: other?.branch_office_postal_code || "",
              perusahaan_afiliasi_info: other?.affiliate_company || "",
              jalan_afiliasi: other?.affiliate_company_street || "",
              kota_afiliasi: other?.affiliate_company_city || "",
              kode_pos_afiliasi: other?.affiliate_company_postal_code || "",

              is_agreed: false,
            });
          }
        }
      } catch (error) {
        console.error("Gagal memeriksa status registrasi:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkRegistration();
  }, [supabase, reset]);

  const getVisualStep = (step: number) => {
    if (step === 1) return 1;
    if (step >= 2 && step <= 5) return 2;
    if (step === 6) return 3;
    return 1;
  };

  const handleNext = async () => {
    let isStepValid = false;

    if (currentStep === 1) {
      isStepValid = await trigger([
        "surat_permohonan",
        "surat_pernyataan",
        "foto_kantor",
        "sk_domisili",
        "akta_notaris",
        "sk_kemenkumham",
        "siup_nib",
        "company_profile",
        "npwp_perusahaan",
      ]);
    } else if (currentStep === 2) {
      isStepValid = await trigger([
        "tanggal_pengajuan",
        "jenis_permohonan",
        "jenis_ncage",
        "tujuan_penerbitan",
        "tipe_entitas",
        "status_kepemilikan",
        "is_ahu_registered",
        "koordinat_kantor",
        "nib",
        "npwp",
        "bidang_usaha",
      ]);
    } else if (currentStep === 3) {
      isStepValid = await trigger([
        "nama_pemohon",
        "nomor_identitas",
        "alamat_pemohon",
        "no_hp_pemohon",
        "email_pemohon",
        "jabatan_pemohon",
      ]);
    } else if (currentStep === 4) {
      isStepValid = await trigger([
        "nama_badan_usaha",
        "provinsi",
        "kota",
        "alamat_kantor",
        "kode_pos",
        "po_box",
        "no_telepon_kantor",
        "no_fax_kantor",
        "email_kantor",
        "website_kantor",
        "perusahaan_afiliasi",
      ]);
    } else if (currentStep === 5) {
      isStepValid = await trigger([
        "produk_dihasilkan",
        "kemampuan_produksi",
        "jumlah_karyawan",
        "kantor_cabang",
        "jalan_cabang",
        "kota_cabang",
        "kode_pos_cabang",
        "perusahaan_afiliasi_info",
        "jalan_afiliasi",
        "kota_afiliasi",
        "kode_pos_afiliasi",
      ]);
    } else {
      isStepValid = true;
    }

    if (!isStepValid) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector(".text-red-500");
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const onSubmit = () => {
    if (currentStep !== 6) {
      handleNext();
      return;
    }

    setModalState("confirm");
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Sesi anda telah berakhir, silakan login ulang.");
        return;
      }

      const data = methods.getValues();

      const uploadedPaths: Record<string, string> = {};

      for (const field of FILE_FIELDS) {
        const file = data[field];
        if (file && file instanceof File) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${field}_${Date.now()}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("ncage_documents")
              .upload(filePath, file);

          if (uploadError) {
            console.error(`Gagal upload ${field}:`, uploadError);
            throw new Error(`Gagal mengunggah dokumen: ${field}`);
          }

          uploadedPaths[field] = uploadData.path;
        } else if (typeof file === "string") {
          uploadedPaths[field] = file;
        }
      }

      let appId = existingAppId;

      if (existingAppId) {
        const { error: appError } = await supabase
          .from("ncage_applications")
          .update({
            status_id: STATUS_PERMOHONAN_DIKIRIM,
            documents: uploadedPaths,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingAppId);
        if (appError)
          throw new Error(`[ncage_applications] ${appError.message}`);

        try {
          const adminSupabase = createAdminClient();
          await adminSupabase.from("notifications").insert({
            user_id: user.id,
            type: "info",
            title: isNearExpiry
              ? "Pembaruan Dokumen NCAGE Berhasil Dikirim"
              : "Perbaikan Permohonan Berhasil Dikirim",
            description: isNearExpiry
              ? "Dokumen pembaruan NCAGE Anda telah berhasil dikirim dan sedang dalam proses verifikasi sebelum masa berlaku habis."
              : "Permohonan NCAGE Anda yang telah diperbaiki berhasil dikirim ulang dan sedang dalam proses verifikasi.",
            related_application_id: existingAppId,
          });
        } catch (_) {}

        const { error: identityError } = await supabase
          .from("application_identities")
          .update({
            submission_date: data.tanggal_pengajuan || null,
            application_type: data.jenis_permohonan,
            ncage_request_type: data.jenis_ncage,
            purpose: data.tujuan_penerbitan,
            entity_type: data.tipe_entitas,
            building_ownership_status: data.status_kepemilikan,
            is_ahu_registered:
              data.is_ahu_registered === "Ya" ||
              data.is_ahu_registered === "true",
            office_coordinate: data.koordinat_kantor,
            nib: data.nib,
            npwp: data.npwp,
            business_field: data.bidang_usaha,
          })
          .eq("ncage_application_id", existingAppId);
        if (identityError)
          throw new Error(`[application_identities] ${identityError.message}`);

        const { error: contactError } = await supabase
          .from("application_contacts")
          .update({
            name: data.nama_pemohon,
            identity_number: data.nomor_identitas,
            address: data.alamat_pemohon,
            phone_number: data.no_hp_pemohon,
            email: data.email_pemohon,
            position: data.jabatan_pemohon,
          })
          .eq("ncage_application_id", existingAppId);
        if (contactError)
          throw new Error(`[application_contacts] ${contactError.message}`);

        const { error: companyError } = await supabase
          .from("company_details")
          .update({
            name: data.nama_badan_usaha,
            province: data.provinsi,
            city: data.kota,
            street: data.alamat_kantor,
            postal_code: data.kode_pos,
            po_box: data.po_box,
            phone: data.no_telepon_kantor,
            fax: data.no_fax_kantor,
            email: data.email_kantor,
            website: data.website_kantor,
            affiliate: data.perusahaan_afiliasi,
          })
          .eq("ncage_application_id", existingAppId);
        if (companyError)
          throw new Error(`[company_details] ${companyError.message}`);

        const { error: otherError } = await supabase
          .from("other_informations")
          .update({
            products: data.produk_dihasilkan,
            production_capacity: data.kemampuan_produksi,
            number_of_employees: data.jumlah_karyawan,
            branch_office_name: data.kantor_cabang,
            branch_office_street: data.jalan_cabang,
            branch_office_city: data.kota_cabang,
            branch_office_postal_code: data.kode_pos_cabang,
            affiliate_company: data.perusahaan_afiliasi_info,
            affiliate_company_street: data.jalan_afiliasi,
            affiliate_company_city: data.kota_afiliasi,
            affiliate_company_postal_code: data.kode_pos_afiliasi,
          })
          .eq("ncage_application_id", existingAppId);
        if (otherError)
          throw new Error(`[other_informations] ${otherError.message}`);
      } else {
        // Generate nomor permohonan dengan format NCG+DDMMYYYY+urutan
        const applicationNumber = await generateApplicationNumber();

        const { data: appData, error: appError } = await supabase
          .from("ncage_applications")
          .insert({
            user_id: user.id,
            status_id: STATUS_PERMOHONAN_DIKIRIM,
            documents: uploadedPaths,
            application_number: applicationNumber,
          })
          .select("id")
          .single();

        if (appError)
          throw new Error(`[ncage_applications] ${appError.message}`);
        appId = appData.id;

        try {
          const adminSupabase = createAdminClient();
          await adminSupabase.from("notifications").insert({
            user_id: user.id,
            type: "success",
            title: "Pendaftaran NCAGE Berhasil Dikirim",
            description:
              "Permohonan NCAGE Anda telah berhasil dikirim dan sedang dalam proses verifikasi oleh tim Puskod Kemhan.",
            related_application_id: appData.id,
          });
        } catch (_) {}

        const { error: identityError } = await supabase
          .from("application_identities")
          .insert({
            ncage_application_id: appId,
            submission_date: data.tanggal_pengajuan || null,
            application_type: data.jenis_permohonan,
            ncage_request_type: data.jenis_ncage,
            purpose: data.tujuan_penerbitan,
            entity_type: data.tipe_entitas,
            building_ownership_status: data.status_kepemilikan,
            is_ahu_registered:
              data.is_ahu_registered === "Ya" ||
              data.is_ahu_registered === "true",
            office_coordinate: data.koordinat_kantor,
            nib: data.nib,
            npwp: data.npwp,
            business_field: data.bidang_usaha,
          });
        if (identityError)
          throw new Error(`[application_identities] ${identityError.message}`);

        const { error: contactError } = await supabase
          .from("application_contacts")
          .insert({
            ncage_application_id: appId,
            name: data.nama_pemohon,
            identity_number: data.nomor_identitas,
            address: data.alamat_pemohon,
            phone_number: data.no_hp_pemohon,
            email: data.email_pemohon,
            position: data.jabatan_pemohon,
          });
        if (contactError)
          throw new Error(`[application_contacts] ${contactError.message}`);

        const { error: companyError } = await supabase
          .from("company_details")
          .insert({
            ncage_application_id: appId,
            name: data.nama_badan_usaha,
            province: data.provinsi,
            city: data.kota,
            street: data.alamat_kantor,
            postal_code: data.kode_pos,
            po_box: data.po_box,
            phone: data.no_telepon_kantor,
            fax: data.no_fax_kantor,
            email: data.email_kantor,
            website: data.website_kantor,
            affiliate: data.perusahaan_afiliasi,
          });
        if (companyError)
          throw new Error(`[company_details] ${companyError.message}`);

        const { error: otherError } = await supabase
          .from("other_informations")
          .insert({
            ncage_application_id: appId,
            products: data.produk_dihasilkan,
            production_capacity: data.kemampuan_produksi,
            number_of_employees: data.jumlah_karyawan,
            branch_office_name: data.kantor_cabang,
            branch_office_street: data.jalan_cabang,
            branch_office_city: data.kota_cabang,
            branch_office_postal_code: data.kode_pos_cabang,
            affiliate_company: data.perusahaan_afiliasi_info,
            affiliate_company_street: data.jalan_afiliasi,
            affiliate_company_city: data.kota_afiliasi,
            affiliate_company_postal_code: data.kode_pos_afiliasi,
          });
        if (otherError)
          throw new Error(`[other_informations] ${otherError.message}`);
      }

      setModalState("success");
    } catch (error) {
      console.error("Terjadi kesalahan saat submit:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses pendaftaran.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8a1515]/20 border-t-[#8a1515] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          Memeriksa status pengguna...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden mb-12 relative">
      {modalState === "already_registered" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white border border-gray-100 rounded-[15px] w-full max-w-lg overflow-hidden shadow-xl px-10 py-14 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-information-fill text-4xl text-amber-600"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              Pendaftaran Ditemukan
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Anda sudah melakukan pendaftaran NCAGE.
              <br />
              Silakan pantau status pengajuan Anda melalui halaman pantau
              status.
            </p>
            <button
              onClick={() => router.push("/pantau-status")}
              className="w-full py-4 px-4 bg-[#8a1515] hover:bg-[#6e1010] text-white font-medium rounded-[15px] transition-colors shadow-lg shadow-red-900/10 active:scale-95"
            >
              Lanjut Pantau Status
            </button>
          </div>
        </div>
      )}
      {isNearExpiry && expiryInfo && (
        <div className={`mx-6 mt-6 flex items-start gap-3 p-4 rounded-xl border ${
          expiryInfo.daysLeft <= 0
            ? "bg-red-50 border-red-200"
            : "bg-amber-50 border-amber-200"
        }`}>
          <i className={`text-xl mt-0.5 shrink-0 ${
            expiryInfo.daysLeft <= 0
              ? "ri-error-warning-line text-red-500"
              : "ri-alarm-warning-line text-amber-500"
          }`} />
          <div>
            <p className={`font-semibold text-[14px] ${
              expiryInfo.daysLeft <= 0 ? "text-red-800" : "text-amber-800"
            }`}>
              {expiryInfo.daysLeft <= 0
                ? "Kode NCAGE Telah Kadaluarsa"
                : `Masa Berlaku NCAGE Akan Habis dalam ${expiryInfo.daysLeft} Hari`}
            </p>
            <p className={`text-[13px] mt-0.5 leading-relaxed ${
              expiryInfo.daysLeft <= 0 ? "text-red-700" : "text-amber-700"
            }`}>
              {expiryInfo.daysLeft <= 0
                ? <>
                    Kode NCAGE Anda telah kadaluarsa pada <strong>{expiryInfo.date}</strong>.
                    Kirimkan kembali dokumen terbaru Anda di bawah ini untuk proses perpanjangan.
                    Data lama Anda sudah terisi otomatis.
                  </>
                : <>
                    Kode NCAGE Anda akan kadaluarsa pada <strong>{expiryInfo.date}</strong>.
                    Perbarui dokumen Anda di bawah ini agar proses perpanjangan dapat segera diproses.
                    Dokumen lama Anda sudah terisi otomatis.
                  </>
              }
            </p>
          </div>
        </div>
      )}

      <Stepper currentStep={getVisualStep(currentStep)} steps={NCAGE_STEPS} />

      <div className="p-6 md:p-10 bg-white">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={currentStep === 1 ? "block" : "hidden"}>
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-50 px-6 pt-10 pb-8 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-gray-900">
                    Unggah Dokumen Persyaratan
                  </h3>
                  <p className="text-sm text-gray-500 mt-3">
                    Pastikan semua dokumen dalam format yang sesuai dan terbaca
                    dengan jelas.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-b-2xl p-8 md:p-10 bg-white shadow-sm">
                  <Step1Upload />
                </div>
              </div>
            </div>

            {currentStep >= 2 && currentStep <= 5 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-50 px-6 pt-10 pb-8 rounded-t-2xl border border-gray-200 border-b-0 flex flex-col items-center text-center">
                  <span className="text-sm font-medium text-gray-500 mb-4">
                    Lengkapi Formulir Permintaan
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">
                    {currentStep === 2 && "a. Identifikasi Entitas"}
                    {currentStep === 3 && "b. Informasi Kontak"}
                    {currentStep === 4 && "c. Detail Badan Usaha"}
                    {currentStep === 5 && "d. Informasi Lainnya"}
                  </h3>
                </div>

                <div className="border border-gray-200 rounded-b-2xl p-8 md:p-10 bg-white shadow-sm">
                  <div className={currentStep === 2 ? "block" : "hidden"}>
                    <SectionAIdentitas />
                  </div>
                  <div className={currentStep === 3 ? "block" : "hidden"}>
                    <SectionBContact />
                  </div>
                  <div className={currentStep === 4 ? "block" : "hidden"}>
                    <SectionCBadanUsaha />
                  </div>
                  <div className={currentStep === 5 ? "block" : "hidden"}>
                    <SectionDInformasiLainnya />
                  </div>
                </div>
              </div>
            )}
            <div className={currentStep === 6 ? "block" : "hidden"}>
              <Step3Review />
            </div>

            <div className="mt-10 flex justify-between items-center">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-6 py-2.5 font-semibold rounded-lg transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kembali
              </button>

              {currentStep === 6 ? (
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#8a1515] hover:bg-[#6e1010] text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Kirim Pendaftaran
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-[#8a1515] hover:bg-[#6e1010] text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Lanjutkan
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      <SubmissionModal
        isOpen={modalState === "confirm" || modalState === "success"}
        type={modalState === "success" ? "success" : "confirm"}
        onClose={() => {
          if (modalState === "success") {
            router.push("/pantau-status");
          } else {
            setModalState("closed");
          }
        }}
        onConfirm={handleConfirmSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
