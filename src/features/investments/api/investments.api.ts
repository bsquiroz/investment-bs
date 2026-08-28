import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/lib/database.types";

export async function listPlatforms() {
  const { data, error } = await supabase
    .from("investment_platforms")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createPlatform(payload: TablesInsert<"investment_platforms">) {
  const { data, error } = await supabase
    .from("investment_platforms")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updatePlatform(id: string, payload: TablesUpdate<"investment_platforms">) {
  const { data, error } = await supabase
    .from("investment_platforms")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deletePlatform(id: string) {
  const { error } = await supabase.from("investment_platforms").delete().eq("id", id);
  if (error) throw error;
}

export async function listMovements() {
  const { data, error } = await supabase
    .from("investment_movements")
    .select("*")
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createMovement(payload: TablesInsert<"investment_movements">) {
  const { data, error } = await supabase
    .from("investment_movements")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateMovement(id: string, payload: TablesUpdate<"investment_movements">) {
  const { data, error } = await supabase
    .from("investment_movements")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMovement(id: string) {
  const { error } = await supabase.from("investment_movements").delete().eq("id", id);
  if (error) throw error;
}
