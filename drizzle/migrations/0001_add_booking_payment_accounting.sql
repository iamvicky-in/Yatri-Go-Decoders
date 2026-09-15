ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_environment text NOT NULL DEFAULT 'sandbox',
  ADD COLUMN IF NOT EXISTS payment_transaction_id text,
  ADD COLUMN IF NOT EXISTS platform_fee integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vendor_earnings integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_payment_transaction_id_idx
  ON public.bookings (payment_transaction_id)
  WHERE payment_transaction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS bookings_vendor_payment_idx
  ON public.bookings (vendor_id, payment_status);

CREATE OR REPLACE FUNCTION public.validate_booking_payment_state()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.payment_status NOT IN ('unpaid', 'pending', 'paid', 'failed', 'refunded') THEN
    RAISE EXCEPTION 'Invalid payment status';
  END IF;
  IF NEW.payment_environment NOT IN ('sandbox', 'live') THEN
    RAISE EXCEPTION 'Invalid payment environment';
  END IF;
  IF NEW.platform_fee < 0 OR NEW.vendor_earnings < 0 OR NEW.amount < 0 THEN
    RAISE EXCEPTION 'Payment amounts cannot be negative';
  END IF;
  IF NEW.payment_status <> 'paid' AND NEW.status = 'Confirmed' THEN
    RAISE EXCEPTION 'A booking cannot be confirmed before payment';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_booking_payment_state_trigger ON public.bookings;
CREATE TRIGGER validate_booking_payment_state_trigger
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.validate_booking_payment_state();

COMMENT ON COLUMN public.bookings.platform_fee IS 'Platform-held fee in INR minor whole units for this INR-only catalog.';
COMMENT ON COLUMN public.bookings.vendor_earnings IS 'Amount payable to the vendor after the platform fee.';