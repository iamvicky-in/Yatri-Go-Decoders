import { lazy, Suspense, useEffect, useState } from "react";
import { Loader2, LocateFixed, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { vendorCategories, vendors as allVendors, type Vendor, type VendorCategory } from "@/lib/yatri-data";
import { VerifiedBadge } from "./verified-badge";
import { Rating } from "./rating";
import type { RoutePath } from "./leaflet-map";

const LeafletMap = lazy(() => import("./leaflet-map"));

const cityCentres: Record<string, [number, number]> = {
  Jaipur: [26.9124, 75.7873],
  Udaipur: [24.5854, 73.7125],
  Goa: [15.2993, 74.124],
};

type Directions = {
  distanceKm: number;
  minutes: number;
  steps: string[];
  approximateStart: boolean;
};

function currentPosition(): Promise<[number, number] | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => resolve(null),
      { timeout: 6000, maximumAge: 300000 },
    );
  });
}

/**
 * Interactive OpenStreetMap view with real markers and driving directions
 * from the traveller's location (routing by the public OSRM service).
 */
export function MapView({
  vendors = allVendors,
  height = "h-[460px]",
}: {
  vendors?: Vendor[];
  height?: string;
}) {
  const [filter, setFilter] = useState<VendorCategory | "All">("All");
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [route, setRoute] = useState<RoutePath>(null);
  const [directions, setDirections] = useState<Directions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const visible = filter === "All" ? vendors : vendors.filter((v) => v.category === filter);

  function clearRoute() {
    setRoute(null);
    setDirections(null);
    setError("");
  }

  async function getDirections(vendor: Vendor) {
    setLoading(true);
    setError("");
    try {
      const located = await currentPosition();
      const fallback = cityCentres[vendor.city] ?? [vendor.lat + 0.03, vendor.lng + 0.03];
      const from = located ?? (fallback as [number, number]);
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${vendor.lng},${vendor.lat}?overview=full&geometries=geojson&steps=true`,
      );
      if (!res.ok) throw new Error(`Routing failed (${res.status})`);
      const data = (await res.json()) as {
        routes?: {
          distance: number;
          duration: number;
          geometry: { coordinates: [number, number][] };
          legs: { steps: { name: string; distance: number; maneuver: { type: string; modifier?: string } }[] }[];
        }[];
      };
      const best = data.routes?.[0];
      if (!best) throw new Error("No route found between those points.");
      setRoute({
        from,
        coords: best.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
      });
      setDirections({
        distanceKm: Math.round((best.distance / 1000) * 10) / 10,
        minutes: Math.round(best.duration / 60),
        approximateStart: !located,
        steps: (best.legs[0]?.steps ?? []).slice(0, 10).map((s) => {
          const move = [s.maneuver.type, s.maneuver.modifier].filter(Boolean).join(" ");
          const road = s.name ? ` onto ${s.name}` : "";
          return `${move.charAt(0).toUpperCase()}${move.slice(1)}${road} · ${Math.round(s.distance)} m`;
        }),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load directions right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {vendorCategories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => {
              setFilter(c.key);
              setSelected(null);
              clearRoute();
            }}
            className={cn(
              "rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              filter === c.key
                ? "bg-primary text-primary-foreground border-transparent"
                : "bg-background hover:bg-secondary",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className={cn("surface-card relative z-0 overflow-hidden", height)}>
          {mounted ? (
            <Suspense
              fallback={
                <div className="text-muted-foreground grid h-full place-items-center text-sm">Loading map…</div>
              }
            >
              <LeafletMap
                vendors={visible}
                selectedId={selected?.id}
                onSelect={(v) => {
                  setSelected(v);
                  clearRoute();
                }}
                route={route}
                className="h-full w-full"
              />
            </Suspense>
          ) : (
            <div className="text-muted-foreground grid h-full place-items-center text-sm">Loading map…</div>
          )}
        </div>

        <div className="surface-card p-5">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{selected.name}</h3>
                  <p className="text-muted-foreground text-xs">
                    {selected.category} · {selected.area}, {selected.city}
                  </p>
                </div>
                <VerifiedBadge verified={selected.verified} label={selected.verified ? "Verified" : "Unverified"} />
              </div>
              <Rating value={selected.rating} reviews={selected.reviews} />
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground text-xs">Distance</dt>
                  <dd className="font-medium">{selected.distanceKm} km</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Price range</dt>
                  <dd className="font-medium">{selected.priceRange}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Hours</dt>
                  <dd className="font-medium">{selected.hours}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground text-xs">Contact</dt>
                  <dd className="font-medium">{selected.phone}</dd>
                </div>
              </dl>
              <p className="text-muted-foreground text-sm">{selected.description}</p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="rounded-md">
                  <a href={`tel:${selected.phone.replace(/\s/g, "")}`}>
                    <Phone className="size-4" /> Call
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-md"
                  disabled={loading}
                  onClick={() => void getDirections(selected)}
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Navigation className="size-4" />}
                  Directions
                </Button>
                <Button asChild size="sm" variant="ghost" className="rounded-md">
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open in maps
                  </a>
                </Button>
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              {directions && (
                <div className="space-y-2 border-t pt-3">
                  <p className="text-sm font-semibold">
                    {directions.distanceKm} km · about {directions.minutes} min by road
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                    <LocateFixed className="size-3.5" />
                    {directions.approximateStart
                      ? `Starting from ${selected.city} city centre — allow location access for door-to-door directions.`
                      : "Starting from your current location."}
                  </p>
                  <ol className="text-muted-foreground max-h-44 space-y-1 overflow-y-auto text-xs">
                    {directions.steps.map((s, i) => (
                      <li key={i} className="border-b pb-1 last:border-0">
                        {i + 1}. {s}
                      </li>
                    ))}
                  </ol>
                  <Button size="sm" variant="ghost" className="rounded-md" onClick={clearRoute}>
                    Clear route
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid h-full place-items-center text-center">
              <div>
                <h3 className="font-semibold">Select a pin</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Tap any marker for ratings, pricing, hours, verification status and driving directions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
