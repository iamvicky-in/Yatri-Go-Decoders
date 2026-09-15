import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { googleMapsDirectionsUrl, googleMapsEmbedUrl } from "@/lib/vendors-api";
import { MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatINR, type Destination, type Vendor, type CultureExperience } from "@/lib/yatri-data";
import { VerifiedBadge } from "./verified-badge";
import { Rating } from "./rating";

export function DestinationCard({ d }: { d: Destination }) {
  return (
    <article className="surface-card card-hover group overflow-hidden border-0">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={d.image}
          alt={`${d.name}, ${d.state}`}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="bg-budget text-budget-foreground absolute top-3 left-3 rounded-sm px-3 py-1 text-xs font-bold">
          From {formatINR(d.fromBudget)}
        </span>
      </div>
      <div className="space-y-3 border-t-4 border-accent p-5">
        <div>
          <h3 className="text-lg font-bold">{d.name}</h3>
          <p className="text-muted-foreground text-xs">{d.state}</p>
        </div>
        <p className="text-muted-foreground text-sm">{d.blurb}</p>
        <p className="text-xs font-medium">
          Best for: <span className="text-accent">{d.bestFor.join(" • ")}</span>
        </p>
        <Button asChild variant="secondary" className="w-full rounded-md">
          <Link to="/plan" search={{ destination: d.name }}>
            Explore {d.name}
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function VendorCard({
  v,
  onView,
  onBook,
}: {
  v: Vendor;
  onView?: (v: Vendor) => void;
  onBook?: (v: Vendor) => void;
}) {
  const [showMap, setShowMap] = useState(false);
  return (
    <article className="surface-card card-hover flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={v.image}
          alt={v.name}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover"
        />
        <span className="bg-background/90 absolute top-3 left-3 rounded-sm px-2.5 py-1 text-[11px] font-semibold">
          {v.category}
        </span>
        {v.verified && <VerifiedBadge verified className="absolute top-3 right-3" label="Verified" />}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold">{v.name}</h3>
          <Rating value={v.rating} />
        </div>
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <MapPin className="size-3.5" /> {v.area}, {v.city} · {v.distanceKm} km away
        </p>
        <p className="text-muted-foreground text-sm">{v.description}</p>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setShowMap((s) => !s)}
              className="text-accent underline-offset-2 hover:underline"
            >
              {showMap ? "Hide map" : "Show map"}
            </button>
            <a
              href={googleMapsDirectionsUrl(v)}
              target="_blank"
              rel="noreferrer"
              className="text-accent inline-flex items-center gap-1 underline-offset-2 hover:underline"
            >
              <Navigation className="size-3.5" /> Directions
            </a>
          </div>
          {showMap && (
            <iframe
              title={`Map of ${v.name}`}
              src={googleMapsEmbedUrl(v)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-40 w-full rounded-md border"
            />
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="nums text-sm font-semibold">{v.priceRange}</p>
            <p className={cn("text-xs", v.openNow ? "text-verified" : "text-muted-foreground")}>
              {v.openNow ? "Open now" : "Closed"} · {v.reviews} reviews
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-md" onClick={() => onView?.(v)}>
              View Service
            </Button>
            {onBook && (
              <Button size="sm" className="rounded-md" onClick={() => onBook(v)}>
                Book
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ExperienceCard({ e }: { e: CultureExperience }) {
  return (
    <article className="surface-card card-hover overflow-hidden border-0">
      <div className="relative aspect-[16/10]">
        <img
          src={e.image}
          alt={e.title}
          loading="lazy"
          width={800}
          height={600}
          className="size-full object-cover"
        />
        <span className="bg-background/90 absolute bottom-3 left-3 rounded-sm px-2.5 py-1 text-[11px] font-semibold">
          {e.theme}
        </span>
      </div>
      <div className="space-y-2 border-t-4 border-accent p-5">
        <h3 className="font-bold">{e.title}</h3>
        <p className="text-muted-foreground text-sm">{e.summary}</p>
        <p className="nums text-sm font-semibold">
          {formatINR(e.price)} <span className="text-muted-foreground font-normal">per person · {e.duration} · {e.city}</span>
        </p>
      </div>
    </article>
  );
}

export function EmergencyCard({
  title,
  vendor,
  icon,
}: {
  title: string;
  vendor: Vendor;
  icon: string;
}) {
  return (
    <article className="surface-card space-y-3 p-5">
      <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
        {icon} {title}
      </p>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{vendor.name}</h3>
          <p className="text-muted-foreground text-xs">
            {vendor.distanceKm} km away · {vendor.openNow ? "Open now" : vendor.hours}
          </p>
        </div>
        <VerifiedBadge verified={vendor.verified} label={vendor.verified ? "Verified" : "Unverified"} />
      </div>
      <div className="flex gap-2">
        <Button asChild size="sm" className="rounded-md">
          <a href={`tel:${vendor.phone.replace(/\s/g, "")}`}>
            <Phone className="size-4" /> Call
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="rounded-md">
          <a
            href={googleMapsDirectionsUrl(vendor)}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation className="size-4" /> Directions
          </a>
        </Button>
      </div>
    </article>
  );
}

export function DashboardCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "verified" | "budget";
}) {
  return (
    <div className="surface-card p-5">
      <p className="text-muted-foreground text-xs font-medium">{label}</p>
      <p
        className={cn(
          "mt-2 font-[family-name:var(--font-display)] text-2xl font-bold",
          tone === "verified" && "text-verified",
          tone === "budget" && "text-budget",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="surface-card grid place-items-center gap-2 p-12 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground max-w-sm text-sm">{body}</p>
    </div>
  );
}
