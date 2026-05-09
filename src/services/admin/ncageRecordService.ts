"use server";

import { createAdminClient } from "@/src/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import type { NcageRecordFormValues } from "@/src/schema/ncageRecordSchema";

export async function getNcageRecordById(id: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("ncage_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[getNcageRecordById] Error:", error.message);
    return null;
  }

  return data;
}

export async function updateNcageRecord(id: string, payload: NcageRecordFormValues) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("ncage_records")
    .update({
      ...payload,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("[updateNcageRecord] Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/ncage-records");
  revalidatePath(`/admin/ncage-records/${id}`);

  return { success: true };
}

export async function deleteNcageRecord(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("ncage_records")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[deleteNcageRecord] Error:", error.message);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/ncage-records");
  return { success: true };
}
