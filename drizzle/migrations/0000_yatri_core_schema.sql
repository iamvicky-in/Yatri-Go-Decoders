-- Roles
create type public.app_role as enum ('admin','vendor','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile write" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "admins read roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- new users get a profile + default role
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user')
  on conflict do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Vendors / listings
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  category text not null,
  city text not null,
  area text not null default '',
  description text not null default '',
  phone text not null default '',
  price_range text not null default '',
  price_from integer not null default 0,
  hours text not null default '',
  image_key text not null default 'jaipur',
  lat double precision not null,
  lng double precision not null,
  rating numeric(2,1) not null default 4.5,
  reviews_count integer not null default 0,
  distance_km numeric(4,1) not null default 2.0,
  open_now boolean not null default true,
  status text not null default 'pending',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.vendors to anon;
grant select, insert, update, delete on public.vendors to authenticated;
grant all on public.vendors to service_role;
alter table public.vendors enable row level security;
create policy "approved vendors are public" on public.vendors for select to anon, authenticated using (status = 'approved');
create policy "owners read own vendors" on public.vendors for select to authenticated using (auth.uid() = owner_id);
create policy "admins read all vendors" on public.vendors for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "anyone signed in can submit" on public.vendors for insert to authenticated with check (auth.uid() = owner_id and status = 'pending');
create policy "owners update own vendors" on public.vendors for update to authenticated using (auth.uid() = owner_id);
create policy "admins update vendors" on public.vendors for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete vendors" on public.vendors for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- Bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default 'YG-' || lpad((floor(random()*90000)+10000)::text, 5, '0'),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  service_name text not null,
  location text not null default '',
  booking_date date not null,
  booking_time text not null,
  guests integer not null default 1,
  amount integer not null default 0,
  customer_name text not null default '',
  customer_phone text not null default '',
  status text not null default 'Confirmed',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.bookings to authenticated;
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;
create policy "own bookings read" on public.bookings for select to authenticated using (auth.uid() = user_id);
create policy "own bookings insert" on public.bookings for insert to authenticated with check (auth.uid() = user_id);
create policy "own bookings update" on public.bookings for update to authenticated using (auth.uid() = user_id);
create policy "admins read bookings" on public.bookings for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "vendors read their bookings" on public.bookings for select to authenticated
  using (exists (select 1 from public.vendors v where v.id = bookings.vendor_id and v.owner_id = auth.uid()));

-- Seed the verified local vendors shown on the map
insert into public.vendors (name, category, city, area, description, phone, price_range, price_from, hours, image_key, lat, lng, rating, reviews_count, distance_km, open_now, status, verified) values
('Rajputana Heritage Stay','Hotel','Jaipur','Bani Park','Restored haveli with 18 rooms, courtyard breakfast and free pickup from Jaipur Junction.','+91 98290 11221','₹1,200 – ₹2,400 / night',1200,'Reception 24×7','jaipur',26.9319,75.7965,4.7,412,2.1,true,'approved',true),
('Pink City Kitchen','Restaurant','Jaipur','MI Road','Rajasthani thalis, dal baati churma and a dependable vegetarian menu.','+91 98290 44510','₹200 – ₹450 / person',200,'8:00 AM – 11:30 PM','varanasi',26.9157,75.8040,4.5,1268,1.4,true,'approved',true),
('Jaipur Auto Care','Mechanic','Jaipur','Tonk Road','Two-wheeler and car repairs, roadside assistance within 8 km of the city centre.','+91 98290 77310','₹300 – ₹2,500 / job',300,'7:00 AM – 10:00 PM','manali',26.8600,75.8000,4.6,286,2.4,true,'approved',true),
('CityCare Medical','Medical','Jaipur','C-Scheme','Multi-speciality clinic with 24×7 pharmacy and in-house diagnostics.','+91 141 400 2020','₹150 consultation',150,'Open 24 hours','udaipur',26.9089,75.7960,4.8,903,1.1,true,'approved',true),
('Marudhar Cabs','Transport','Jaipur','Sindhi Camp','Local sightseeing cabs and airport transfers with fixed-fare day packages.','+91 98290 66004','₹11 / km',11,'Open 24 hours','rishikesh',26.9240,75.7970,4.4,654,3.2,true,'approved',true),
('Chokhi Cloud Kitchen','Cloud Kitchen','Jaipur','Vaishali Nagar','Delivery-only kitchen serving Rajasthani and North Indian meal boxes.','+91 98290 31187','₹150 – ₹350 / meal',150,'10:00 AM – 12:00 AM','goa',26.9110,75.7370,4.3,341,4.6,true,'approved',false),
('Heritage Walks Jaipur','Activity','Jaipur','Chandpole','Sunrise walking tours through the old city with a local historian guide.','+91 98290 55908','₹400 / person',400,'6:30 AM – 9:00 AM','jaipur',26.9280,75.8100,4.9,188,1.8,false,'approved',true),
('Highway Response Desk','Emergency','Jaipur','Ajmer Road','Coordination desk that connects travellers to towing, ambulance and police help.','+91 141 400 9111','Assistance on call',0,'Open 24 hours','kerala',26.8990,75.7500,4.5,97,5.3,true,'approved',true),
('Lakeview Residency','Hotel','Udaipur','Lake Pichola','Rooftop restaurant with lake views and airport transfers on request.','+91 94140 22119','₹1,900 – ₹3,600 / night',1900,'Reception 24×7','udaipur',24.5726,73.6800,4.6,522,0.9,true,'approved',true),
('Coastal Shack Kitchen','Restaurant','Goa','Palolem','Beachfront Goan seafood, thali lunches and vegetarian options.','+91 98221 77341','₹300 – ₹700 / person',300,'9:00 AM – 11:00 PM','goa',15.0100,74.0233,4.4,736,0.4,true,'approved',true),
('Amber Fort Jeep Rides','Activity','Jaipur','Amer','Shared jeep rides up to Amber Fort with a short heritage commentary.','+91 98290 12045','₹250 / person',250,'8:00 AM – 5:30 PM','jaipur',26.9855,75.8513,4.2,143,9.4,true,'pending',false);