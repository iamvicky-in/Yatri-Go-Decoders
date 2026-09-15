import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery, handleSupabaseError } from "./supabase-hooks";
import { useEffect, useState } from "react";

export type BookingRow = {
  id: string;
  reference: string;
  vendor_id: string | null;
  service_name: string;
  location: string;
  booking_date: string;
  booking_time: string;
  guests: number;
  amount: number;
  customer_name: string;
  customer_phone: string;
  status: string;
  payment_status: string;
  payment_environment: string;
  payment_transaction_id: string | null;
  platform_fee: number;
  vendor_earnings: number;
  paid_at: string | null;
  created_at: string;
};

export type NewBooking = {
  vendorId: string | null;
  date: string;
  time: string;
  guests: number;
  customerName: string;
  customerPhone: string;
};

/** Creates an unpaid booking using the approved vendor price stored in the database. */
export async function createBooking(b: NewBooking) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("Please sign in to complete your booking.");

  if (!b.vendorId) throw new Error("This listing is not yet available for secure online booking.");
  const { data, error } = await supabase.rpc("create_pending_booking", {
    p_vendor_id: b.vendorId,
    p_booking_date: b.date,
    p_booking_time: b.time,
    p_guests: b.guests,
    p_customer_name: b.customerName,
    p_customer_phone: b.customerPhone,
    p_payment_environment: "sandbox",
  });

  if (error) throw new Error(error.message);
  return { reference: data.reference, amount: data.amount };
}

export async function cancelBooking(id: string) {
  return handleSupabaseError(supabase.rpc("cancel_own_booking", { p_booking_id: id }));
}

/** Bookings belonging to the signed-in traveller. */
export function useMyBookings(userId: string | undefined) {
  const query = useSupabaseQuery<BookingRow>(
    () => supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    [userId],
    { enabled: !!userId },
  );
  return { ...query, bookings: query.items };
}

export function useAllBookings(enabled: boolean) {
  const { items } = useSupabaseQuery<BookingRow>(
    () => supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    [],
    { enabled },
  );
  return items;
}

export function useVendorBookings(userId: string | undefined) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [vendorName, setVendorName] = useState("Your business");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!userId) return;
    void supabase
      .from("vendors")
      .select("id, name, verified")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(async ({ data: vendor }) => {
        if (!vendor) return;
        setVendorName(vendor.name);
        setVerified(vendor.verified);
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("vendor_id", vendor.id)
          .order("created_at", { ascending: false });
        setBookings((data ?? []) as BookingRow[]);
      });
  }, [userId]);

  return { bookings, vendorName, verified };
}
