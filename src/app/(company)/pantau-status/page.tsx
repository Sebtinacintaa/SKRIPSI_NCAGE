"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PantauStatusPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<{subId: string, docName: string} | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submissions, setSubmissions] = useState([
    {
      id: "NCG_0003052026",
      tanggal: "03 Mei 2026",
      jenis: "Permohonan Baru",
      status: "Verifikasi",
      statusDetail: "Puskod sedang meninjau dokumen Anda",
      statusColor: "yellow",
      progress: 50,
      lastUpdated: "2 jam yang lalu",
      documents: [
        { name: "Surat Permohonan", status: "verified" },
        { name: "Surat Pernyataan", status: "verified" },
        { name: "NPWP Perusahaan", status: "rejected", note: "Dokumen tidak terbaca (blur)" },
        { name: "NIB / SIUP", status: "pending" },
      ],
      dataVerification: [
        { name: "Identitas Pemohon", status: "verified" },
        { name: "Alamat Perusahaan", status: "verified" },
        { name: "Bidang Usaha", status: "pending" },
        { name: "Tipe Entitas", status: "pending" },
      ]
    },
    {
      id: "NCG_0002042026",
      tanggal: "12 Apr 2026",
      jenis: "Permohonan Baru",
      status: "Disetujui",
      statusDetail: "Sertifikat telah diterbitkan",
      statusColor: "green",
      progress: 100,
      lastUpdated: "3 hari yang lalu",
      certificateUrl: "#",
      documents: [
        { name: "Seluruh Dokumen", status: "verified" },
      ],
      dataVerification: [
        { name: "Seluruh Data", status: "verified" },
      ]
    },
    {
      id: "NCG_0001032026",
      tanggal: "05 Mar 2026",
      jenis: "Permohonan Baru",
      status: "Revisi",
      statusDetail: "Ada dokumen yang perlu diperbaiki",
      statusColor: "orange",
      progress: 30,
      lastUpdated: "1 bulan yang lalu",
      feedback: "Dokumen NPWP Perusahaan tidak terbaca dengan jelas (blur). Harap unggah ulang scan dokumen asli.",
      documents: [
        { name: "Surat Permohonan", status: "verified" },
        { name: "Surat Pernyataan", status: "verified" },
        { name: "NPWP Perusahaan", status: "rejected", note: "Scan tidak jelas / blur" },
        { name: "Company Profile", status: "verified" },
      ],
      dataVerification: [
        { name: "Identitas Pemohon", status: "verified" },
        { name: "Alamat Perusahaan", status: "verified" },
        { name: "Bidang Usaha", status: "verified" },
        { name: "Tipe Entitas", status: "verified" },
      ]
    },
  ]);

  const handleUploadClick = (subId: string, docName: string) => {
    setUploadingDoc({ subId, docName });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingDoc) {
      setUploadProgress(1); // Start progress
      
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => finishUpload(), 500);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    } else {
      setUploadingDoc(null);
    }
  };

  const finishUpload = () => {
    if (uploadingDoc) {
      setSubmissions(prev => prev.map(sub => {
        if (sub.id === uploadingDoc.subId) {
          return {
            ...sub,
            documents: sub.documents.map(doc => {
              if (doc.name === uploadingDoc.docName) {
                return { ...doc, status: "pending", note: "Sedang diproses ulang" };
              }
              return doc;
            })
          };
        }
        return sub;
      }));
    }
    setUploadingDoc(null);
    setUploadProgress(0);
  };

  const statusConfig: Record<string, { bg: string, text: string, border: string, icon: string }> = {
    yellow: { bg: "bg-amber-50/50", text: "text-amber-700", border: "border-amber-100", icon: "ri-time-line" },
    green:  { bg: "bg-emerald-50/50", text: "text-emerald-700", border: "border-emerald-100", icon: "ri-checkbox-circle-line" },
    orange: { bg: "bg-orange-50/50", text: "text-orange-700", border: "border-orange-100", icon: "ri-error-warning-line" },
  };

  return (
    <div className="bg-[#FDFDFD] py-12 px-8 md:px-16 lg:px-24 relative min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 pl-4 md:pl-0">
          <div className="relative">
            
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Status Pengajuan
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-md">
              Pantau progres verifikasi dokumen dan unduh sertifikat NCAGE Anda secara real-time.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[13px] font-bold text-slate-600 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all active:scale-95 group">
            <i className="ri-refresh-line group-hover:rotate-180 transition-transform duration-500 text-slate-400"></i>
            Refresh Status
          </button>
        </div>

        {/* Submissions List */}
        <div className="space-y-6">
          {submissions.map((sub) => {
            const isExpanded = expandedId === sub.id;
            const config = statusConfig[sub.statusColor] || statusConfig.yellow;
            const isApproved = sub.status === "Disetujui";

            // Filter documents for separate sections
            const rejectedDocs = sub.documents.filter(d => d.status === 'rejected');
            const otherDocs = sub.documents.filter(d => d.status !== 'rejected');

            return (
              <div 
                key={sub.id} 
                className={`group bg-white rounded-[20px] border transition-all duration-500 ${
                  isExpanded 
                    ? "border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)]" 
                    : "border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02),0_4px_6px_-2px_rgba(0,0,0,0.01)] hover:border-slate-200 hover:shadow-md"
                }`}
              >
                {/* Compact Header */}
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    
                    {/* ID & Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-xl font-bold text-slate-800 tracking-tight">{sub.id}</span>
                        <div className={`px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} flex items-center gap-1.5`}>
                          <i className={`${config.icon} text-xs`}></i>
                          <span className="text-[10px] font-bold uppercase tracking-wider">{sub.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-[13px] text-gray-500 font-medium">
                        <span className="flex items-center gap-2"><i className="ri-calendar-event-line"></i> {sub.tanggal}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="flex items-center gap-2"><i className="ri-file-info-line"></i> {sub.jenis}</span>
                      </div>
                    </div>

                    {/* Progress Bar (Subtle) */}
                    <div className="hidden lg:block w-40 space-y-2">
                       <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400 px-0.5 tracking-widest">
                         <span>Progres</span>
                         <span>{sub.progress}%</span>
                       </div>
                       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full transition-all duration-1000 ease-out ${sub.statusColor === 'green' ? 'bg-emerald-500' : 'bg-[#86000D]'}`} 
                           style={{ width: `${sub.progress}%` }}
                         />
                       </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-3">
                      <button 
                        disabled={!isApproved}
                        className={`h-12 px-6 rounded-[15px] text-sm font-bold transition shadow-lg active:scale-95 flex items-center gap-2 ${
                          isApproved 
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20" 
                            : "bg-gray-100 text-gray-400 border border-gray-200 shadow-none cursor-not-allowed"
                        }`}
                      >
                        <i className="ri-download-2-line"></i>
                        Unduh Sertifikat
                      </button>

                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-[15px] transition-all ${
                          isExpanded ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        <i className={`ri-arrow-down-s-line text-xl transition-transform duration-500 ${isExpanded ? "rotate-180" : ""}`}></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detail Section */}
                {isExpanded && (
                  <div className="px-8 md:px-10 pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="pt-4 border-t border-gray-50 space-y-8">
                      
                      {/* 1. Berkas Harus Diupload Ulang (ONLY IF REJECTED) */}
                      {rejectedDocs.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-0.5 h-4 bg-[#86000D] rounded-full"></div>
                            <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Berkas yang Harus Diupload Ulang</h4>
                          </div>

                          <div className="grid grid-cols-1 gap-4 max-w-4xl">
                            {rejectedDocs.map((doc, idx) => {
                              const isThisUploading = uploadingDoc?.subId === sub.id && uploadingDoc?.docName === doc.name;
                              
                              return (
                                <div key={idx} className="flex flex-col p-6 bg-white rounded-[15px] border border-red-200 transition-all gap-5 shadow-sm">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-[15px] bg-red-50 flex items-center justify-center shrink-0 border border-red-100 text-red-600">
                                        <i className="ri-error-warning-fill text-2xl"></i>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{doc.name}</p>
                                        <p className="text-xs font-medium text-slate-500">{(doc as any).note || ""}</p>
                                      </div>
                                    </div>
                                    
                                    {!isThisUploading ? (
                                      <button 
                                        onClick={() => handleUploadClick(sub.id, doc.name)}
                                        className="px-6 py-2.5 bg-[#86000D] text-white text-[11px] font-bold rounded-[15px] hover:bg-[#6e1010] transition active:scale-95 shadow-lg shadow-red-900/20 flex items-center gap-2"
                                      >
                                        <i className="ri-upload-cloud-2-line text-sm"></i>
                                        Upload Ulang
                                      </button>
                                    ) : (
                                      <div className="text-right space-y-2 min-w-[140px]">
                                        <p className="text-[11px] font-bold text-[#86000D] uppercase">Sedang Mengunggah...</p>
                                        <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                            className="h-full bg-[#86000D] rounded-full"
                                          />
                                        </div>
                                        <p className="text-[10px] font-bold text-[#86000D]/60">{uploadProgress}%</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. Verifikasi Dokumen (Oke & Pending) */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-0.5 h-4 bg-slate-400 rounded-full"></div>
                          <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Verifikasi Dokumen</h4>
                        </div>

                        <div className="max-w-4xl border-t border-slate-50">
                          {otherDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50 group/item transition-all hover:bg-slate-50/30 px-2">
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                  doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  <i className={doc.status === 'verified' ? 'ri-check-line text-lg' : 'ri-time-line text-lg'}></i>
                                </div>
                                <span className="text-sm font-medium text-slate-600">{doc.name}</span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                doc.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'
                              }`}>
                                {doc.status === 'verified' ? 'Oke' : 'Proses Verifikasi'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. Verifikasi Data */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-0.5 h-4 bg-slate-400 rounded-full"></div>
                          <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Verifikasi Data</h4>
                        </div>

                        <div className="max-w-4xl border-t border-slate-50">
                          {sub.dataVerification?.map((data, idx) => (
                            <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50 group/item transition-all hover:bg-slate-50/30 px-2">
                               <div className="flex items-center gap-4 pl-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    data.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-400'
                                  }`}></div>
                                  <span className="text-sm font-medium text-slate-600">{data.name}</span>
                               </div>
                               <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                 data.status === 'verified' ? 'text-emerald-600' : 'text-amber-600'
                               }`}>
                                 {data.status === 'verified' ? 'Valid' : 'Sedang Proses'}
                               </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Komentar Verifikator */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-0.5 h-4 bg-slate-400 rounded-full"></div>
                          <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">Komentar Verifikator</h4>
                        </div>
                        
                        <div className={`p-6 rounded-[15px] border max-w-4xl ${sub.status === 'Revisi' ? 'bg-orange-50/50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                          {sub.status === 'Revisi' ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-orange-700">
                                <i className="ri-chat-delete-line text-lg"></i>
                                <span className="text-sm font-extrabold uppercase">Koreksi Diperlukan:</span>
                              </div>
                              <p className="text-sm text-orange-950 leading-relaxed font-medium">
                                {sub.feedback}
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                                <i className="ri-admin-line text-gray-400"></i>
                              </div>
                              <p className="text-sm text-gray-500 italic font-medium leading-relaxed pt-2">
                                {sub.status === 'Disetujui' ? "Puskod menyatakan seluruh berkas Anda VALID. Sertifikat Anda sudah diterbitkan dan dapat diunduh melalui tombol di atas." : "Verifikator sedang meninjau kelengkapan data dan dokumen Anda. Mohon tunggu proses validasi."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Subtle Footer */}
                <div className="px-6 md:px-8 py-4 bg-white border-t border-gray-50 flex items-center justify-between rounded-b-[20px]">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                     <span className="text-[13px] font-medium text-gray-500">Terakhir diperbarui: {sub.lastUpdated}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
