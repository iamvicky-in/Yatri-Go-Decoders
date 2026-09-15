DROP POLICY IF EXISTS "own bookings insert" ON public.bookings;
DROP POLICY IF EXISTS "own bookings update" ON public.bookings;
REVOKE INSERT, UPDATE ON public.bookings FROM authenticated;

CREATE OR REPLACE FUNCTION public.create_pending_booking(
  p_vendor_id uuid,
  p_booking_date date,
  p_booking_time text,
  p_guests integer,
  p_customer_name text,
  p_customer_phone text,
  p_payment_environment text DEFAULT 'sandbox'
)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  selected_vendor public.vendors;
  new_booking public.bookings;
  calculated_amount integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_guests < 1 OR p_guests > 20 THEN
    RAISE EXCEPTION 'Guests must be between 1 and 20';
  END IF;
  IF p_booking_date < current_date THEN
    RAISE EXCEPTION 'Booking date cannot be in the past';
  END IF;
  IF length(trim(p_customer_name)) < 2 OR length(regexp_replace(p_customer_phone, '[^0-9]', '', 'g')) < 10 THEN
    RAISE EXCEPTION 'Valid customer details are required';
  END IF;
  SELECT * INTO selected_vendor
  FROM public.vendors
  WHERE id = p_vendor_id AND status = 'approved' AND verified = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This verified service is not available for booking';
  END IF;
  IF selected_vendor.price_from <= 0 THEN
    RAISE EXCEPTION 'This vendor has not confirmed a bookable price';
  END IF;
  calculated_amount := selected_vendor.price_from * p_guests;
  INSERT INTO public.bookings (
    user_id, vendor_id, service_name, location, booking_date, booking_time,
    guests, amount, customer_name, customer_phone, status, payment_status,
    payment_environment, platform_fee, vendor_earnings
  ) VALUES (
    auth.uid(), selected_vendor.id, selected_vendor.name,
    concat_ws(', ', nullif(selected_vendor.area, ''), selected_vendor.city),
    p_booking_date, p_booking_time, p_guests, calculated_amount,
    trim(p_customer_name), trim(p_customer_phone), 'Awaiting payment', 'pending',
    p_payment_environment, 0, 0
  ) RETURNING * INTO new_booking;
  RETURN new_booking;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_own_booking(p_booking_id uuid)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed public.bookings;
BEGIN
  UPDATE public.bookings
  SET status = 'Cancelled'
  WHERE id = p_booking_id
    AND user_id = auth.uid()
    AND status <> 'Cancelled'
  RETURNING * INTO changed;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Booking not found or already cancelled';
  END IF;
  RETURN changed;
END;
$$;

REVOKE ALL ON FUNCTION public.create_pending_booking(uuid, date, text, integer, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_pending_booking(uuid, date, text, integer, text, text, text) TO authenticated;
REVOKE ALL ON FUNCTION public.cancel_own_booking(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_own_booking(uuid) TO authenticated;