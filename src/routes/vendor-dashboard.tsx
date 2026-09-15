import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/yatri/cards";
import { VerifiedBadge } from "@/components/yatri/verified-badge";
import { formatINR, reviews } from "@/lib/yatri-data";
import { useAuth } from "@/lib/auth";
import { PortalLogin } from "@/components/yatri/portal-login";
import { useVendorBookings } from "@/lib/bookings-api";

export const Route = createFileRoute("/vendor-dashboard")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard — YATRI GO" },
      {
        name: "description",
        content:
          "Manage services, pricing, availability, bookings, reviews, payments and your verification status as a YATRI GO vendor.",
      },
      { property: "og:title", content: "Vendor Dashboard — YATRI GO" },
      {
        property: "og:description",
        content: "Bookings, enquiries, revenue and verification in one view.",
      },
    ],
  }),
  component: VendorDashboard,
});

type Service = { id: string; name: string; price: number; available: boolean };

const initialServices: Service[] = [
  { id: "s1", name: "Deluxe room (2 guests)", price: 1200, available: true },
  { id: "s2", name: "Family suite (4 guests)", price: 2400, available: true },
  { id: "s3", name: "Airport pickup", price: 650, available: false },
];

function VendorDashboard() {
  const [services, setServices] = useState(initialServices);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(900);
  const { user, loading } = useAuth();
  const { bookings, vendorName, verified } = useVendorBookings(user?.id);
  const signedOut = !loading && !user;
  const paidBookings = bookings.filter((booking) => booking.payment_status === "paid");
  const earnings = paidBookings.reduce((sum, booking) => sum + booking.vendor_earnings, 0);

  if (signedOut) {
    return (
      <PortalLogin
        title="Vendor portal"
        subtitle="Sign in with your business email and password."
      />
    );
  }

  return (
    <section className="container-page py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">Vendor</p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{vendorName}</h1>
          <p className="text-muted-foreground mt-1">Live booking and payment records</p>
        </div>
        <VerifiedBadge verified={verified} />
      </header>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard label="Total views" value="12,480" hint="Last 30 days" />
        <DashboardCard label="Profile visits" value="3,210" />
        <DashboardCard label="Bookings" value={String(bookings.length)} tone="verified" />
        <DashboardCard
          label="Earnings"
          value={formatINR(earnings)}
          tone="budget"
          hint="From paid bookings"
        />
        <DashboardCard label="Customer enquiries" value="41" />
        <DashboardCard label="Rating" value="4.7" hint="412 reviews" />
        <DashboardCard label="Verification" value="Verified" tone="verified" />
        <DashboardCard
          label="Awaiting payment"
          value={String(bookings.filter((b) => b.payment_status === "pending").length)}
        />
      </div>

      <Tabs defaultValue="services" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-md p-1.5">
          {[
            "services",
            "bookings",
            "customers",
            "reviews",
            "analytics",
            "verification",
            "payments",
          ].map((t) => (
            <TabsTrigger key={t} value={t} className="rounded-md capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="services" className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="surface-card divide-y overflow-hidden">
            {services.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatINR(s.price)} · {s.available ? "Available" : "Paused"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() =>
                      setServices((list) =>
                        list.map((x) => (x.id === s.id ? { ...x, price: x.price + 100 } : x)),
                      )
                    }
                  >
                    +₹100
                  </Button>
                  <Button
                    size="sm"
                    variant={s.available ? "secondary" : "default"}
                    className="rounded-lg"
                    onClick={() =>
                      setServices((list) =>
                        list.map((x) => (x.id === s.id ? { ...x, available: !x.available } : x)),
                      )
                    }
                  >
                    {s.available ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg"
                    onClick={() => setServices((list) => list.filter((x) => x.id !== s.id))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <form
            className="surface-card space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              setServices((list) => [
                ...list,
                { id: `s${Date.now()}`, name: name.trim(), price, available: true },
              ]);
              setName("");
              toast.success("Service added.");
            }}
          >
            <h2 className="font-bold">Add a service</h2>
            <div className="space-y-2">
              <Label htmlFor="sv-name">Service name</Label>
              <Input
                id="sv-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-md"
                placeholder="Rooftop dinner for two"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sv-price">Price (₹)</Label>
              <Input
                id="sv-price"
                type="number"
                min={50}
                step={50}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="rounded-md"
              />
            </div>
            <Button type="submit" className="w-full rounded-md">
              Add service
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          <div className="surface-card divide-y overflow-hidden">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{b.service_name}</p>
                  <p className="text-muted-foreground text-xs">
                    {b.reference} · {b.booking_date} · {b.booking_time} · {b.guests} guests ·{" "}
                    {formatINR(b.amount)}
                  </p>
                </div>
                <span className="bg-secondary rounded-sm px-2.5 py-1 text-[11px] font-semibold">
                  {b.status} · {b.payment_status}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <div className="surface-card divide-y overflow-hidden">
            {[
              { n: "Ananya R.", m: "Is early check-in possible on 15 Oct?", t: "2 hours ago" },
              { n: "Imran S.", m: "Do you have parking for two cars?", t: "Yesterday" },
              { n: "Meera K.", m: "Can you arrange an airport pickup at 6 AM?", t: "3 days ago" },
            ].map((c) => (
              <div key={c.n} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="font-semibold">{c.n}</p>
                  <p className="text-muted-foreground text-sm">{c.m}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs">{c.t}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-lg"
                    onClick={() => toast.success("Reply sent (prototype).")}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <article key={r.id} className="surface-card space-y-2 p-6">
                <p className="text-budget">{"★".repeat(r.rating)}</p>
                <p className="text-muted-foreground text-sm">{r.text}</p>
                <p className="text-muted-foreground text-xs">
                  {r.author} · {r.date}
                </p>
              </article>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="surface-card space-y-5 p-6">
            <h2 className="font-bold">Views over the last 6 months</h2>
            <div className="flex h-48 items-end gap-3">
              {[38, 52, 44, 67, 81, 96].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="bg-accent w-full rounded-t-sm" style={{ height: `${v}%` }} />
                  <span className="text-muted-foreground text-[11px]">
                    {["Apr", "May", "Jun", "Jul", "Aug", "Sep"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="mt-6">
          <div className="surface-card max-w-2xl space-y-4 p-6">
            <VerifiedBadge verified />
            <ol className="space-y-3 text-sm">
              {[
                ["Business photos", "3 photos approved"],
                ["Business information", "Approved"],
                ["Video verification", "Completed 12 Aug 2026"],
                ["Admin verification", "Verified 13 Aug 2026"],
              ].map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <span className="font-medium">{k}</span>
                  <span className="text-verified text-xs font-semibold">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <DashboardCard label="Paid earnings" value={formatINR(earnings)} tone="budget" />
            <DashboardCard
              label="Platform fees"
              value={formatINR(paidBookings.reduce((sum, b) => sum + b.platform_fee, 0))}
              hint="Recorded on paid bookings"
            />
            <DashboardCard label="Paid transactions" value={String(paidBookings.length)} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
