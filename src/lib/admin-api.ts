import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery, handleSupabaseError } from "./supabase-hooks";

export type SiteContentRow = { key: string; value: string; label: string };
export type ServiceOfferingRow = {
  id: string;
  title: string;
  category: string;
  description: string;
  price_from: number;
  city: string;
  active: boolean;
  sort_order: number;
};
export type EmergencyContactRow = {
  id: string;
  label: string;
  name: string;
  phone: string;
  city: string;
  category: string;
  active: boolean;
  sort_order: number;
};
export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
};
export type RoleRow = { id: string; user_id: string; role: "admin" | "vendor" | "user" };

/** Editable site copy, keyed by content key. Falls back to the passed default. */
export function useSiteContent() {
  const { items, loading, refresh } = useSupabaseQuery<SiteContentRow>(() =>
    supabase.from("site_content").select("key, value, label").order("key"),
  );
  const text = useCallback(
    (key: string, fallback: string) =>
      (Array.isArray(items) ? items : []).find((r) => r.key === key)?.value.trim() || fallback,
    [items],
  );
  return { rows: items, text, loading, refresh };
}

export async function saveSiteContent(key: string, value: string) {
  await handleSupabaseError(
    supabase
      .from("site_content")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("key", key),
  );
}

export function useServiceOfferings(adminView = false) {
  return useSupabaseQuery<ServiceOfferingRow>(() => {
    let q = supabase.from("service_offerings").select("*").order("sort_order");
    if (!adminView) q = q.eq("active", true);
    return q;
  }, [adminView]);
}

export async function saveServiceOffering(row: Partial<ServiceOfferingRow>) {
  const { id, ...rest } = row;
  if (id) return handleSupabaseError(supabase.from("service_offerings").update(rest).eq("id", id));
  return handleSupabaseError(
    supabase.from("service_offerings").insert({
      title: row.title ?? "Untitled service",
      category: row.category ?? "Activity",
      description: row.description ?? "",
      price_from: row.price_from ?? 0,
      city: row.city ?? "",
      active: row.active ?? true,
      sort_order: row.sort_order ?? 0,
    }),
  );
}

export async function deleteServiceOffering(id: string) {
  return handleSupabaseError(supabase.from("service_offerings").delete().eq("id", id));
}

export function useEmergencyContacts(adminView = false) {
  return useSupabaseQuery<EmergencyContactRow>(() => {
    let q = supabase.from("emergency_contacts").select("*").order("sort_order");
    if (!adminView) q = q.eq("active", true);
    return q;
  }, [adminView]);
}

export async function saveEmergencyContact(row: Partial<EmergencyContactRow>) {
  const { id, ...rest } = row;
  if (id) return handleSupabaseError(supabase.from("emergency_contacts").update(rest).eq("id", id));
  return handleSupabaseError(
    supabase.from("emergency_contacts").insert({
      label: row.label ?? "New contact",
      name: row.name ?? "",
      phone: row.phone ?? "112",
      city: row.city ?? "All India",
      category: row.category ?? "Helpline",
      active: row.active ?? true,
      sort_order: row.sort_order ?? 0,
    }),
  );
}

export async function deleteEmergencyContact(id: string) {
  return handleSupabaseError(supabase.from("emergency_contacts").delete().eq("id", id));
}

/** Registered people plus their roles (admin only). */
export function useAdminUsers(enabled: boolean) {
  const {
    items: profiles,
    loading: lp,
    refresh: rp,
  } = useSupabaseQuery<ProfileRow>(
    () => supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    [],
    { enabled },
  );
  const {
    items: roles,
    loading: lr,
    refresh: rr,
  } = useSupabaseQuery<RoleRow>(() => supabase.from("user_roles").select("*"), [], { enabled });
  return {
    profiles,
    roles,
    loading: lp || lr,
    refresh: async () => {
      await Promise.all([rp(), rr()]);
    },
  };
}

export async function grantRole(userId: string, role: RoleRow["role"]) {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error && !error.message.includes("duplicate")) throw new Error(error.message);
}

export async function revokeRole(userId: string, role: RoleRow["role"]) {
  return handleSupabaseError(
    supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role),
  );
}

export async function updateBookingAdmin(
  id: string,
  patch: { status?: string; payment_status?: string },
) {
  return handleSupabaseError(supabase.from("bookings").update(patch).eq("id", id));
}

export async function deleteBookingAdmin(id: string) {
  return handleSupabaseError(supabase.from("bookings").delete().eq("id", id));
}

export type VendorPatch = Partial<{
  name: string;
  category: string;
  city: string;
  area: string;
  phone: string;
  price_from: number;
  price_range: string;
  hours: string;
  description: string;
  status: string;
  verified: boolean;
  rating: number;
  reviews_count: number;
  open_now: boolean;
  image_key: string;
  owner_name: string;
  owner_email: string;
  registration_id: string;
  verification_notes: string;
}>;

export async function updateVendorAdmin(id: string, patch: VendorPatch) {
  return handleSupabaseError(supabase.from("vendors").update(patch).eq("id", id));
}

/** Admin-created listing: live on the map straight away. */
export async function createVendorAdmin(row: {
  name: string;
  category: string;
  city: string;
  area: string;
  phone: string;
  price_from: number;
  price_range: string;
  hours: string;
  description: string;
  lat: number;
  lng: number;
}) {
  return handleSupabaseError(
    supabase.from("vendors").insert({ ...row, status: "approved", verified: true }),
  );
}

export async function deleteVendorAdmin(id: string) {
  return handleSupabaseError(supabase.from("vendors").delete().eq("id", id));
}
