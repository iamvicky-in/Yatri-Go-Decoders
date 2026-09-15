import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmergencyCard, EmptyState, VendorCard } from "@/components/yatri/cards";
import { VendorDialog } from "@/components/yatri/booking-dialog";
import { MapView } from "@/components/yatri/map-view";
import {
  vendorCategories,
  vendors,
  getVendor,
  type Vendor,
  type VendorCategory,
} from "@/lib/yatri-data";
import { useApprovedVendors } from "@/lib/vendors-api";
import { useEmergencyContacts, useServiceOfferings, useSiteContent } from "@/lib/admin-api";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services Near You — Verified Local Vendors | YATRI GO" },
      {
        name: "description",
        content:
          "Hotels, restaurants, cloud kitchens, medical, mechanics, transport, activities and emergency desks — verified and searchable in plain language.",
      },
      { property: "og:title", content: "Services Near You — YATRI GO" },
      {
        property: "og:description",
        content: "Search verified local travel services by price, rating and distance.",
      },
    ],
  }),
  component: Services,
});

/** Very small natural-language matcher for the prototype search. */
function matches(v: Vendor, q: string) {
  if (!q.trim()) return true;
  const text = q.toLowerCase();
  const priceCap = text.match(/under\s*₹?\s*([\d,]+)/);
  if (priceCap && v.priceFrom > Number((priceCap[1] ?? "0").replace(/,/g, ""))) return false;
  const haystack =
    `${v.name} ${v.category} ${v.city} ${v.area} ${v.description} ${v.priceRange}`.toLowerCase();
  const words = text
    .replace(/under\s*₹?\s*[\d,]+/, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["near", "me", "for", "the", "people"].includes(w));
  if (!words.length) return true;
  return words.some((w) => haystack.includes(w));
}

function Services() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VendorCategory | "All">("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [dialogVendor, setDialogVendor] = useState<Vendor | null>(null);
  const [dialogMode, setDialogMode] = useState<"details" | "book">("details");

  const { vendors: liveVendors } = useApprovedVendors();
  const { text } = useSiteContent();
  const { items: offerings } = useServiceOfferings();
  const { items: helplines } = useEmergencyContacts();
  const catalogue = liveVendors.length ? liveVendors : vendors;

  const results = catalogue.filter(
    (v) =>
      (category === "All" || v.category === category) &&
      (!verifiedOnly || v.verified) &&
      matches(v, query),
  );

  return (
    <>
      <section className="bg-surface border-b py-14">
        <div className="container-page space-y-5">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            {text("services_title", "Services Near You")}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {text(
              "services_subtitle",
              "Search the way you'd ask a friend — “hotel near Hawa Mahal”, “mechanic near me”, “restaurant under ₹500”.",
            )}
          </p>
          <div className="relative max-w-2xl">
            <Search className="text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="budget hotel for 4 people in Jaipur"
              className="h-12 rounded-md pl-11"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {vendorCategories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === c.key
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-background hover:bg-secondary"
                }`}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                verifiedOnly
                  ? "bg-verified text-verified-foreground border-transparent"
                  : "bg-background hover:bg-secondary"
              }`}
            >
              Verified only
            </button>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <p className="text-muted-foreground mb-6 text-sm">
          {results.length} {results.length === 1 ? "service" : "services"} found
        </p>
        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((v) => (
              <VendorCard
                key={v.id}
                v={v}
                onView={(vendor) => {
                  setDialogMode("details");
                  setDialogVendor(vendor);
                }}
                onBook={(vendor) => {
                  setDialogMode("book");
                  setDialogVendor(vendor);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing matched that search"
            body="Try a broader phrase, remove the price cap, or switch off the verified-only filter."
          />
        )}
      </section>

      {offerings.length > 0 && (
        <section className="bg-surface border-y py-12">
          <div className="container-page">
            <h2 className="text-3xl font-bold">What you can book</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {offerings.map((o) => (
                <article key={o.id} className="surface-card space-y-2 p-5">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {o.category}
                  </p>
                  <h3 className="font-bold">{o.title}</h3>
                  <p className="text-muted-foreground text-sm">{o.description}</p>
                  <p className="text-sm font-semibold">
                    From ₹{o.price_from} · {o.city || "All cities"}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface py-14">
        <div className="container-page">
          <h2 className="text-3xl font-bold">On the map</h2>
          <p className="text-muted-foreground mt-2">
            Filter by category and tap a pin for details.
          </p>
          <div className="mt-8">
            <MapView vendors={results.length ? results : catalogue} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="border-destructive/30 bg-destructive/5 rounded-md border p-8">
          <h2 className="flex items-center gap-2 text-3xl font-bold">
            <AlertTriangle className="text-destructive size-7" /> Need Help?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm">
            {text(
              "emergency_note",
              "YATRI GO connects you with nearby verified services. It is not an emergency authority — for life-threatening situations call 112 (national emergency), 108 (ambulance) or 100 (police) first.",
            )}
          </p>
          {helplines.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {helplines.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone.replace(/\s/g, "")}`}
                  className="surface-card block p-4 transition-colors hover:bg-secondary"
                >
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {c.label}
                  </p>
                  <p className="mt-1 text-xl font-extrabold">{c.phone}</p>
                  <p className="text-muted-foreground text-xs">
                    {c.name || c.category} · {c.city}
                  </p>
                </a>
              ))}
            </div>
          )}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <EmergencyCard title="Medical emergency" icon="🚑" vendor={getVendor("v-citycare")!} />
            <EmergencyCard title="Vehicle breakdown" icon="🔧" vendor={getVendor("v-autocare")!} />
            <EmergencyCard
              title="Emergency transport"
              icon="🚕"
              vendor={getVendor("v-marudhar")!}
            />
            <EmergencyCard title="Local assistance" icon="📞" vendor={getVendor("v-highway")!} />
          </div>
        </div>
      </section>

      <VendorDialog
        vendor={dialogVendor}
        mode={dialogMode}
        onOpenChange={(open) => !open && setDialogVendor(null)}
      />
    </>
  );
}
