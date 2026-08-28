import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/lib/database.types";

export async function listTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(payload: TablesInsert<"transactions">) {
  const { data, error } = await supabase
    .from("transactions")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
