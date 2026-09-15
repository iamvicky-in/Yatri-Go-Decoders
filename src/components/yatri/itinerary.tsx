import { Clock, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR, getVendor } from "@/lib/yatri-data";
import type { TripDay } from "@/lib/trip-engine";
import { VerifiedBadge } from "./verified-badge";
import type { Vendor } from "@/lib/yatri-data";

export function ItineraryTimeline({
  days,
  onBook,
  onView,
}: {
  days: TripDay[];
  onBook?: (v: Vendor) => void;
  onView?: (v: Vendor) => void;
}) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <section key={day.day} className="surface-card overflow-hidden">
          <header className="bg-surface flex flex-wrap items-center justify-between gap-2 border-b px-6 py-4">
            <h3 className="font-bold">
              Day {day.day} · <span className="text-muted-foreground font-medium">{day.title}</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              {formatINR(day.activities.reduce((s, a) => s + a.cost, 0))} confirmed
            </p>
          </header>
          <ol className="divide-y">
            {day.activities.map((a, i) => {
              const vendor = a.vendorId ? getVendor(a.vendorId) : undefined;
              return (
                <li key={`${day.day}-${i}`} className="flex flex-col gap-3 p-6 sm:flex-row">
                  <div className="sm:w-28">
                    <p className="text-accent flex items-center gap-1.5 text-sm font-semibold">
                      <Clock className="size-4" /> {a.time}
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{a.title}</h4>
                      <span className="bg-secondary rounded-sm px-2 py-0.5 text-[11px] font-medium">
                        {a.category}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">{a.note}</p>
                    <p className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
                      <span className="text-foreground bg-budget-soft rounded-sm px-2 py-0.5 font-semibold">
                        {a.priceConfirmed ? formatINR(a.cost) : "Price unavailable"}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" /> {a.distanceKm} km
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="size-3.5" /> {a.travelMins} min travel
                      </span>
                    </p>
                    {vendor && (
                      <div className="bg-surface flex flex-wrap items-center justify-between gap-3 rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{vendor.name}</span>
                          <VerifiedBadge
                            verified={vendor.verified}
                            label={vendor.verified ? "Verified" : "Unverified"}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            onClick={() => onView?.(vendor)}
                          >
                            View Details
                          </Button>
                          <Button size="sm" className="rounded-lg" onClick={() => onBook?.(vendor)}>
                            Book
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
