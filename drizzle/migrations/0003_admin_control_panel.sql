-- Editable site content
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site content is public" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update site content" ON public.site_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete site content" ON public.site_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Services catalogue
CREATE TABLE public.service_offerings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Activity',
  description text NOT NULL DEFAULT '',
  price_from integer NOT NULL DEFAULT 0,
  city text NOT NULL DEFAULT '',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_offerings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_offerings TO authenticated;
GRANT ALL ON public.service_offerings TO service_role;
ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active services are public" ON public.service_offerings FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert services" ON public.service_offerings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update services" ON public.service_offerings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete services" ON public.service_offerings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Emergency contacts / helplines
CREATE TABLE public.emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  name text NOT NULL DEFAULT '',
  phone text NOT NULL,
  city text NOT NULL DEFAULT 'All India',
  category text NOT NULL DEFAULT 'Helpline',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.emergency_contacts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_contacts TO authenticated;
GRANT ALL ON public.emergency_contacts TO service_role;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "active contacts are public" ON public.emergency_contacts FOR SELECT TO anon, authenticated USING (active OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert contacts" ON public.emergency_contacts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update contacts" ON public.emergency_contacts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete contacts" ON public.emergency_contacts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Admin control over existing tables
CREATE POLICY "admins insert vendors" ON public.vendors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-grant admin to the platform owner email once verified
CREATE OR REPLACE FUNCTION public.grant_admin_for_owner_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF new.email_confirmed_at IS NOT NULL AND lower(new.email) = 'admin@brandoptix.in' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_owner_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_owner_email();

CREATE TRIGGER on_auth_user_confirmed_grant_owner_admin
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_for_owner_email();