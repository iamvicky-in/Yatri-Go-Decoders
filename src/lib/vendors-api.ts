import { supabase } from "@/integrations/supabase/client";
import jaipurImg from "@/assets/dest-jaipur.jpg";
import goaImg from "@/assets/dest-goa.jpg";
import manaliImg from "@/assets/dest-manali.jpg";
import varanasiImg from "@/assets/dest-varanasi.jpg";
import udaipurImg from "@/assets/dest-udaipur.jpg";
import rishikeshImg from "@/assets/dest-rishikesh.jpg";
import keralaImg from "@/assets/dest-kerala.jpg";
import type { Vendor, VendorCategory } from "@/lib/yatri-data";
import { useSupabaseQuery } from "./supabase-hooks";

export const vendorImages: Record<string, string> = {
  jaipur: jaipurImg,
  goa: goaImg,
  manali: manaliImg,
  varanasi: varanasiImg,
  udaipur: udaipurImg,
  rishikesh: rishikeshImg,
  kerala: keralaImg,
};

export type VendorRow = {
  id: string;
  owner_id: string | null;
  name: string;
  category: string;
  city: string;
  area: string;
  description: string;
  phone: string;
  price_range: string;
  price_from: number;
  hours: string;
  image_key: string;
  lat: number;
  lng: number;
  rating: number;
  reviews_count: number;
  distance_km: number;
  open_now: boolean;
  status: string;
  verified: boolean;
  created_at: string;
  owner_name: string;
  owner_email: string;
  registration_id: string;
  photo_urls: string[];
  video_url: string;
  verification_notes: string;
};

/** Temporary links for the private verification photos/videos of one listing. */
export async function signedMediaUrls(paths: string[]) {
  if (paths.length === 0) return [];
  const { data } = await supabase.storage.from("vendor-media").createSignedUrls(paths, 3600);
  return (data ?? [])
    .filter((d) => d.signedUrl)
    .map((d) => ({ path: d.path ?? "", url: d.signedUrl as string }));
}

export function rowToVendor(r: VendorRow): Vendor {
  return {
    id: r.id,
    name: r.name,
    category: r.category as VendorCategory,
    city: r.city,
    area: r.area,
    rating: Number(r.rating),
    reviews: r.reviews_count,
    distanceKm: Number(r.distance_km),
    priceRange: r.price_range,
    priceFrom: r.price_from,
    verified: r.verified,
    openNow: r.open_now,
    hours: r.hours,
    phone: r.phone,
    image: vendorImages[r.image_key] ?? jaipurImg,
    description: r.description,
    x: 50,
    y: 50,
    lat: Number(r.lat),
    lng: Number(r.lng),
  };
}

/** Live approved listings from the backend, mapped to the shared Vendor shape. */
export function useApprovedVendors() {
  const { items, loading } = useSupabaseQuery<VendorRow>(() =>
    supabase
      .from("vendors")
      .select("*")
      .eq("status", "approved")
      .order("rating", { ascending: false }),
  );
  return { vendors: items.map(rowToVendor), loading };
}

export function googleMapsEmbedUrl(v: { lat: number; lng: number; name: string }) {
  return `https://www.google.com/maps?q=${v.lat},${v.lng}&z=15&output=embed`;
}

export function googleMapsDirectionsUrl(v: { lat: number; lng: number }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}&travelmode=driving`;
}
