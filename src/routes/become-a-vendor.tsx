import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LocationPicker } from "@/components/yatri/location-picker";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/become-a-vendor")({
  head: () => ({
    meta: [
      { title: "Become a Vendor — List Your Business on YATRI GO" },
      {
        name: "description",
        content:
          "List your hotel, restaurant, cloud kitchen, mechanic, medical or transport business on YATRI GO and get verified for map visibility and bookings.",
      },
      { property: "og:title", content: "Become a Vendor — YATRI GO" },
      {
        property: "og:description",
        content: "Free listing, verification badge, and travellers already in your city.",
      },
    ],
  }),
  component: BecomeVendor,
});

const categories = [
  "Hotel",
  "Restaurant",
  "Cloud Kitchen",
  "Mechanic",
  "Medical",
  "Transport",
  "Activity",
  "Emergency",
];

const cityCentres: Record<string, [number, number]> = {
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.6839],
  goa: [15.2993, 74.124],
  manali: [32.2432, 77.1892],
  varanasi: [25.3176, 82.9739],
  rishikesh: [30.0869, 78.2676],
  kerala: [9.9312, 76.2673],
};

const benefits = [
  "Verified badge on your listing",
  "Higher trust with travellers",
  "Visibility on the YATRI GO map",
  "Booking opportunities",
  "Direct customer enquiries",
];

function BecomeVendor() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("Hotel");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState({ lat: 26.9124, lng: 75.7873 });
  const [form, setForm] = useState({
    biz: "",
    owner: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    loc: "",
    hours: "",
    services: "",
    pricing: "",
    desc: "",
    registration: "",
  });
  const { user } = useAuth();
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  /** Uploads one file to the private verification folder and returns its stored path. */
  async function upload(userId: string, file: File) {
    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${userId}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from("vendor-media").upload(path, file);
    if (error) throw new Error(error.message);
    return path;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first so we can link this listing to your account.");
      return;
    }
    const cityKey = form.city.trim().toLowerCase();
    const priceFrom = Number(form.pricing.replace(/[^\d]/g, "").slice(0, 6)) || 0;

    setSaving(true);
    try {
      const photoPaths: string[] = [];
      for (const file of photoFiles) photoPaths.push(await upload(user.id, file));
      const videoPath = videoFile ? await upload(user.id, videoFile) : "";

      const { error } = await supabase.from("vendors").insert({
        owner_id: user.id,
        name: form.biz,
        category,
        city: form.city,
        area: form.address,
        description: form.services.trim()
          ? `${form.desc}\n\nServices: ${form.services.trim()}`
          : form.desc,
        phone: form.phone,
        price_range: form.pricing,
        price_from: priceFrom,
        hours: form.hours,
        image_key: cityKey in cityCentres ? cityKey : "jaipur",
        lat: location.lat,
        lng: location.lng,
        status: "pending",
        verified: false,
        owner_name: form.owner,
        owner_email: form.email,
        registration_id: form.registration,
        photo_urls: photoPaths,
        video_url: videoPath,
      });
      if (error) throw new Error(error.message);
      setSubmitted(true);
      toast.success("Listing submitted for verification.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit the listing.");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <section className="container-page py-20">
        <div className="surface-card mx-auto max-w-xl space-y-4 p-10 text-center">
          <CheckCircle2 className="text-verified mx-auto size-14" />
          <h1 className="text-2xl font-bold">Application submitted</h1>
          <p className="text-muted-foreground text-sm">
            Your listing is now <strong>Pending Verification</strong>. Our team reviews business
            details, photos and a short video call, usually within 3 working days.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild className="rounded-md">
              <Link to="/vendor-dashboard">Open Vendor Dashboard</Link>
            </Button>
            <Button variant="outline" className="rounded-md" onClick={() => setSubmitted(false)}>
              Submit another business
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-5">
            <span className="bg-background/15 inline-flex items-center gap-2 rounded-sm px-3.5 py-1.5 text-xs font-semibold">
              <BadgeCheck className="size-3.5" /> Get Verified on YATRI GO
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl">List Your Business</h1>
            <p className="text-primary-foreground/80 max-w-xl">
              Travellers land on YATRI GO already knowing their dates and budget. Put your business
              in front of them — listing is free.
            </p>
            <ul className="grid gap-2 pt-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="text-verified size-4" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background/10 space-y-4 rounded-md p-7">
            <h2 className="text-lg font-bold">Verification in 4 steps</h2>
            <ol className="space-y-3 text-sm">
              {[
                "Upload business photos",
                "Submit business information",
                "Short video verification call",
                "Platform / admin verification",
              ].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="bg-background/20 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="text-primary-foreground/70 text-xs">
              Status moves through Pending Verification → Verified or Rejected, with a reason.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <form className="surface-card mx-auto max-w-3xl space-y-6 p-7 sm:p-9" onSubmit={submit}>
          <h2 className="text-2xl font-bold">Vendor registration</h2>
          {!user && (
            <p className="text-destructive text-sm font-semibold">
              Please sign in before submitting so we can link this listing to your account.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="biz"
              label="Business name"
              placeholder="Rajputana Heritage Stay"
              required
              value={form.biz}
              onChange={set("biz")}
            />
            <Field
              id="owner"
              label="Owner name"
              placeholder="Vikram Singh"
              required
              value={form.owner}
              onChange={set("owner")}
            />
            <Field
              id="phone"
              label="Phone"
              placeholder="+91 98290 11221"
              required
              type="tel"
              value={form.phone}
              onChange={set("phone")}
            />
            <Field
              id="email"
              label="Email"
              placeholder="stay@rajputana.in"
              required
              type="email"
              value={form.email}
              onChange={set("email")}
            />
          </div>

          <div className="space-y-2">
            <Label>Business category</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "hover:bg-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="address"
              label="Address"
              placeholder="12, Bani Park"
              required
              value={form.address}
              onChange={set("address")}
            />
            <Field
              id="city"
              label="City"
              placeholder="Jaipur"
              required
              value={form.city}
              onChange={set("city")}
            />
            <Field
              id="hours"
              label="Operating hours"
              placeholder="8:00 AM – 11:00 PM"
              required
              value={form.hours}
              onChange={set("hours")}
            />
            <Field
              id="services"
              label="Services offered"
              placeholder="Rooms, breakfast, airport pickup"
              value={form.services}
              onChange={set("services")}
            />
            <Field
              id="pricing"
              label="Pricing"
              placeholder="₹1,200 – ₹2,400 per night"
              required
              value={form.pricing}
              onChange={set("pricing")}
            />
            <Field
              id="registration"
              label="GST / registration number"
              placeholder="08ABCDE1234F1Z5"
              value={form.registration}
              onChange={set("registration")}
            />
          </div>

          <LocationPicker value={location} onChange={setLocation} />

          <div className="space-y-2">
            <Label htmlFor="desc">Business description</Label>
            <Textarea
              id="desc"
              required
              rows={4}
              value={form.desc}
              onChange={(e) => set("desc")(e.target.value)}
              placeholder="Tell travellers what makes your business worth choosing."
              className="rounded-md"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos">Business photos</Label>
            <label
              htmlFor="photos"
              className="hover:bg-secondary flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-8 text-center"
            >
              <Upload className="text-muted-foreground size-6" />
              <span className="text-sm font-medium">Click to upload photos</span>
              <span className="text-muted-foreground text-xs">
                {photoFiles.length
                  ? `${photoFiles.length} photo(s) selected`
                  : "JPG or PNG, at least 3 photos"}
              </span>
            </label>
            <input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoFiles(Array.from(e.target.files ?? []))}
            />
            {photoFiles.length > 0 && (
              <ul className="text-muted-foreground space-y-1 text-xs">
                {photoFiles.map((p) => (
                  <li key={p.name}>• {p.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Verification video (optional)</Label>
            <label
              htmlFor="video"
              className="hover:bg-secondary flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-6 text-center"
            >
              <Upload className="text-muted-foreground size-5" />
              <span className="text-sm font-medium">
                {videoFile ? videoFile.name : "Upload a short walkthrough video"}
              </span>
              <span className="text-muted-foreground text-xs">MP4 up to 50 MB</span>
            </label>
            <input
              id="video"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-muted-foreground text-xs">
              Photos and video are private — only you and our verification team can open them.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full rounded-md" disabled={saving}>
            {saving ? "Submitting…" : "Submit for verification"}
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            Your listing is saved and appears to our admin team for review. Once approved it shows
            on the map and in search.
          </p>
        </form>
      </section>
    </>
  );
}

function Field({
  id,
  label,
  placeholder,
  required,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md"
      />
    </div>
  );
}
