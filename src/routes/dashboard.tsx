import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard, EmptyState, VendorCard } from "@/components/yatri/cards";
import { BudgetTracker } from "@/components/yatri/budget";
import { VendorDialog } from "@/components/yatri/booking-dialog";
import { VerifiedBadge } from "@/components/yatri/verified-badge";
import { usePlan } from "@/lib/trip-store";
import { cancelBooking, useMyBookings } from "@/lib/bookings-api";
import { useApprovedVendors } from "@/lib/vendors-api";
import { useAuth } from "@/lib/auth";
import { formatINR, reviews, sampleTrips, vendors, type Vendor } from "@/lib/yatri-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Trips & Bookings — YATRI GO" },
      {
        name: "description",
        content:
          "Track upcoming trips, bookings, saved places, favourite vendors and your travel budget in one traveller dashboard.",
      },
      { property: "og:title", content: "My Trips & Bookings — YATRI GO" },
      { property: "og:description", content: "Your trips, bookings and budget in one place." },
    ],
  }),
  component: UserDashboard,
});

function UserDashboard() {
  const plan = usePlan();
  const { user, loading } = useAuth();
  const { items: bookings, refresh } = useMyBookings(user?.id);
  const { vendors: liveVendors } = useApprovedVendors();
  const catalogue = liveVendors.length ? liveVendors : vendors;
  const allBookings = bookings.map((b) => ({
    id: b.id,
    reference: b.reference,
    service: b.service_name,
    date: b.booking_date,
    time: b.booking_time,
    guests: b.guests,
    amount: b.amount,
    status: b.status,
    paymentStatus: b.payment_status,
  }));
  const activeBookings = allBookings.filter(
    (b) => b.status === "Confirmed" && b.paymentStatus === "paid",
  ).length;
  const [dialogVendor, setDialogVendor] = useState<Vendor | null>(null);
  const favourites = catalogue.filter((v) => v.verified).slice(0, 3);
  const firstName =
    (user?.user_metadata as { full_name?: string } | undefined)?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "traveller";

  if (!loading && !user) {
    return (
      <section className="container-page py-20 text-center">
        <h1 className="text-3xl font-extrabold">Sign in to see your trips</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md">
          Your bookings, saved places and trip budgets are stored on your account.
        </p>
        <Button asChild className="mt-6 rounded-md">
          <Link to="/login">Login or create an account</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Namaste, {firstName}</h1>
          <p className="text-muted-foreground mt-1">Here's everything on your travel plate.</p>
        </div>
        <Button asChild className="rounded-md">
          <Link to="/plan">Plan a new trip</Link>
        </Button>
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Upcoming trips" value="2" />
        <DashboardCard label="Active bookings" value={String(activeBookings)} tone="verified" />
        <DashboardCard
          label="Planned spend"
          value={formatINR(plan ? plan.total : 6400)}
          tone="budget"
        />
        <DashboardCard label="Saved places" value="9" />
      </div>

      <Tabs defaultValue="trips" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-md p-1.5">
          {["trips", "bookings", "saved", "favourites", "reviews", "profile"].map((t) => (
            <TabsTrigger key={t} value={t} className="rounded-md capitalize">
              {t === "trips" ? "My Trips" : t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="trips" className="mt-6 space-y-6">
          {plan && (
            <div className="surface-card space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-accent text-xs font-bold uppercase">Latest AI plan</p>
                  <h2 className="text-xl font-bold">
                    {plan.input.destination} · {plan.nights}N/{plan.days}D
                  </h2>
                </div>
                <Button asChild variant="outline" className="rounded-md">
                  <Link to="/plan">Open planner</Link>
                </Button>
              </div>
              <BudgetTracker budget={plan.input.budget} spent={plan.total} />
            </div>
          )}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sampleTrips.map((t) => (
              <article key={t.id} className="surface-card space-y-3 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{t.destination}</h3>
                  <span className="bg-secondary rounded-sm px-2.5 py-1 text-[11px] font-semibold">
                    {t.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {t.dates} · {t.travellers} travellers
                </p>
                <BudgetTracker budget={t.budget} spent={t.spent} />
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="rounded-md">
                    <Link
                      to="/plan"
                      search={{
                        destination: t.destination,
                        budget: t.budget,
                        travellers: t.travellers,
                      }}
                    >
                      Itinerary
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="rounded-md">
                    <Link to="/services">Map & services</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <div className="surface-card divide-y overflow-hidden">
            {allBookings.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  No bookings yet. Book a verified local service and it will appear here.
                </p>
                <Button asChild className="mt-4 rounded-md">
                  <Link to="/services">Browse services</Link>
                </Button>
              </div>
            )}
            {allBookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{b.service}</p>
                  <p className="text-muted-foreground text-xs">
                    {b.reference} · {b.date} · {b.time} · {b.guests} guests
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatINR(b.amount)}</span>
                  <span
                    className={`rounded-sm px-2.5 py-1 text-[11px] font-semibold ${
                      b.status === "Confirmed"
                        ? "bg-verified-soft text-verified"
                        : b.status === "Pending"
                          ? "bg-budget-soft text-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {b.status} · {b.paymentStatus}
                  </span>
                  {b.status !== "Cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-md"
                      onClick={() => {
                        void cancelBooking(b.id).then(refresh);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalogue.slice(0, 6).map((v) => (
              <VendorCard key={v.id} v={v} onView={setDialogVendor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favourites" className="mt-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favourites.map((v) => (
              <VendorCard key={v.id} v={v} onView={setDialogVendor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <article key={r.id} className="surface-card space-y-2 p-6">
                <p className="font-semibold">{r.vendor}</p>
                <p className="text-budget text-sm">{"★".repeat(r.rating)}</p>
                <p className="text-muted-foreground text-sm">{r.text}</p>
                <p className="text-muted-foreground text-xs">
                  {r.author} · {r.date}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <div className="surface-card max-w-xl space-y-4 p-6">
            <div className="flex items-center gap-4">
              <span className="gradient-hero text-primary-foreground grid size-14 place-items-center rounded-md text-xl font-bold">
                VS
              </span>
              <div>
                <p className="font-bold">Vicky Sharma</p>
                <p className="text-muted-foreground text-sm">vicky@example.com · +91 98765 43210</p>
              </div>
            </div>
            <VerifiedBadge verified label="Email verified" />
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">Notifications</p>
              <p>Booking updates, budget alerts and verified vendor replies are on.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {!sampleTrips.length && (
        <EmptyState title="No trips yet" body="Plan your first trip to see it here." />
      )}

      <VendorDialog
        vendor={dialogVendor}
        mode="details"
        onOpenChange={(open) => !open && setDialogVendor(null)}
      />
    </section>
  );
}
