import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardCard } from "@/components/yatri/cards";
import { formatINR } from "@/lib/yatri-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PortalLogin } from "@/components/yatri/portal-login";
import type { VendorRow } from "@/lib/vendors-api";
import { useAllBookings } from "@/lib/bookings-api";
import {
  createVendorAdmin,
  deleteBookingAdmin,
  deleteEmergencyContact,
  deleteServiceOffering,
  deleteVendorAdmin,
  grantRole,
  revokeRole,
  saveEmergencyContact,
  saveServiceOffering,
  updateBookingAdmin,
  updateVendorAdmin,
  useAdminUsers,
  useEmergencyContacts,
  useServiceOfferings,
  useSiteContent,
  saveSiteContent,
} from "@/lib/admin-api";
import {
  PasswordChangeCard,
  ContentRow,
  ServiceEditor,
  ContactEditor,
  VendorRowEditor,
  VendorCreateForm,
} from "@/components/admin/admin-editors";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — YATRI GO" },
      {
        name: "description",
        content:
          "Full platform control: website content, services catalogue, vendor listings, users, roles, bookings and emergency contacts.",
      },
      { property: "og:title", content: "Admin Console — YATRI GO" },
      { property: "og:description", content: "Manage every part of the YATRI GO platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Admin,
});

const TABS = [
  "overview",
  "content",
  "services",
  "vendors",
  "users",
  "bookings",
  "emergency",
  "settings",
] as const;

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [listings, setListings] = useState<VendorRow[]>([]);
  const bookings = useAllBookings(isAdmin);
  const content = useSiteContent();
  const services = useServiceOfferings(true);
  const contacts = useEmergencyContacts(true);
  const users = useAdminUsers(isAdmin);

  const paidBookings = bookings.filter((b) => b.payment_status === "paid");
  const grossRevenue = paidBookings.reduce((s, b) => s + b.amount, 0);
  const platformRevenue = paidBookings.reduce((s, b) => s + b.platform_fee, 0);

  const loadListings = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .order("created_at", { ascending: false });
    setListings((data ?? []) as VendorRow[]);
  }, [isAdmin]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  async function run(
    action: () => Promise<void>,
    message: string,
    after?: () => Promise<void> | void,
  ) {
    try {
      await action();
      toast.success(message);
      await after?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  if (!loading && (!user || !isAdmin)) {
    return (
      <PortalLogin
        title="Admin portal"
        subtitle="Sign in with your admin email and password."
        blocked={user ? "This account does not have admin rights on this platform." : undefined}
      />
    );
  }

  const pending = listings.filter((l) => l.status === "pending");
  const roleOf = (id: string) => users.roles.filter((r) => r.user_id === id).map((r) => r.role);

  return (
    <section className="container-page py-12">
      <header>
        <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">Admin</p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">Platform console</h1>
        <p className="text-muted-foreground mt-1">
          Website content, services, listings, people, bookings and emergency contacts — all in one
          place.
        </p>
      </header>

      <Tabs defaultValue="overview" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-md p-1.5">
          {TABS.map((t) => (
            <TabsTrigger key={t} value={t} className="rounded-md capitalize">
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard label="Registered users" value={String(users.profiles.length)} />
          <DashboardCard label="Total listings" value={String(listings.length)} />
          <DashboardCard
            label="Verified listings"
            value={String(listings.filter((v) => v.verified).length)}
            tone="verified"
          />
          <DashboardCard label="Awaiting review" value={String(pending.length)} />
          <DashboardCard label="Bookings" value={String(bookings.length)} />
          <DashboardCard label="Paid bookings" value={String(paidBookings.length)} />
          <DashboardCard label="Booking value" value={formatINR(grossRevenue)} tone="budget" />
          <DashboardCard
            label="Platform revenue"
            value={formatINR(platformRevenue)}
            tone="budget"
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Edit the words travellers see on the website. Changes go live as soon as you save.
          </p>
          <div className="surface-card divide-y overflow-hidden">
            {content.rows.map((row) => (
              <ContentRow
                key={row.key}
                label={row.label || row.key}
                value={row.value}
                onSave={(value) =>
                  run(() => saveSiteContent(row.key, value), "Content updated.", content.refresh)
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="mt-6 space-y-5">
          <ServiceEditor
            onSave={(row) =>
              run(() => saveServiceOffering(row), "Service saved.", services.refresh)
            }
          />
          <div className="surface-card divide-y overflow-hidden">
            {services.items.length === 0 && (
              <p className="text-muted-foreground p-6 text-sm">
                No services yet. Add your first one above.
              </p>
            )}
            {services.items.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {s.category} · {s.city || "All cities"} · from {formatINR(s.price_from)} ·{" "}
                    {s.active ? "Published" : "Hidden"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-md"
                    onClick={() =>
                      void run(
                        () => saveServiceOffering({ id: s.id, active: !s.active }),
                        s.active ? "Service hidden." : "Service published.",
                        services.refresh,
                      )
                    }
                  >
                    {s.active ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive rounded-md"
                    onClick={() =>
                      void run(
                        () => deleteServiceOffering(s.id),
                        "Service removed.",
                        services.refresh,
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="mt-6 space-y-5">
          {pending.length > 0 && (
            <div className="surface-card divide-y overflow-hidden">
              <p className="p-4 text-sm font-semibold">Waiting for review</p>
              {pending.map((v) => (
                <div key={v.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {v.category} · {v.area ? `${v.area}, ` : ""}
                      {v.city} · {v.price_range}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="rounded-md"
                      onClick={() =>
                        void run(
                          () => updateVendorAdmin(v.id, { status: "approved", verified: true }),
                          "Listing approved and live on the map.",
                          loadListings,
                        )
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive rounded-md"
                      onClick={() =>
                        void run(
                          () => updateVendorAdmin(v.id, { status: "rejected", verified: false }),
                          "Listing rejected.",
                          loadListings,
                        )
                      }
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-6">
            <VendorCreateForm
              onSave={(row) => run(() => createVendorAdmin(row), "Listing added.", loadListings)}
            />
          </div>

          <div className="surface-card divide-y overflow-hidden">
            {listings.map((v) => (
              <VendorRowEditor
                key={v.id}
                vendor={v}
                onSave={(patch) =>
                  run(() => updateVendorAdmin(v.id, patch), "Listing updated.", loadListings)
                }
                onDelete={() =>
                  run(() => deleteVendorAdmin(v.id), "Listing deleted.", loadListings)
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="surface-card divide-y overflow-hidden">
            {users.profiles.length === 0 && (
              <p className="text-muted-foreground p-6 text-sm">No registered people yet.</p>
            )}
            {users.profiles.map((p) => {
              const roles = roleOf(p.id);
              return (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold">{p.full_name || "Unnamed traveller"}</p>
                    <p className="text-muted-foreground text-xs">
                      {p.email} {p.phone ? `· ${p.phone}` : ""} · {roles.join(", ") || "no role"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["admin", "vendor", "user"] as const).map((role) => {
                      const has = roles.includes(role);
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant={has ? "ghost" : "outline"}
                          className="rounded-md capitalize"
                          onClick={() =>
                            void run(
                              () => (has ? revokeRole(p.id, role) : grantRole(p.id, role)),
                              has ? `${role} access removed.` : `${role} access granted.`,
                              users.refresh,
                            )
                          }
                        >
                          {has ? `Remove ${role}` : `Make ${role}`}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <DashboardCard label="Paid bookings" value={String(paidBookings.length)} />
            <DashboardCard
              label="Awaiting payment"
              value={String(bookings.filter((b) => b.payment_status === "pending").length)}
            />
            <DashboardCard
              label="Avg. paid booking"
              value={formatINR(paidBookings.length ? grossRevenue / paidBookings.length : 0)}
              tone="budget"
            />
          </div>
          <div className="surface-card divide-y overflow-hidden">
            {bookings.length === 0 && (
              <p className="text-muted-foreground p-6 text-sm">No bookings yet.</p>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">
                    {b.reference} · {b.service_name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {b.customer_name} · {b.booking_date} {b.booking_time} · {b.guests} guests ·{" "}
                    {formatINR(b.amount)} · {b.status} / {b.payment_status}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-md"
                    onClick={() =>
                      void run(
                        () => updateBookingAdmin(b.id, { status: "Cancelled" }),
                        "Booking cancelled.",
                        () => window.location.reload(),
                      )
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive rounded-md"
                    onClick={() =>
                      void run(
                        () => deleteBookingAdmin(b.id),
                        "Booking removed.",
                        () => window.location.reload(),
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="mt-6 space-y-5">
          <ContactEditor
            onSave={(row) =>
              run(() => saveEmergencyContact(row), "Contact saved.", contacts.refresh)
            }
          />
          <div className="surface-card divide-y overflow-hidden">
            {contacts.items.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-semibold">
                    {c.label} — {c.phone}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {c.name || c.category} · {c.city} · {c.active ? "Visible" : "Hidden"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-md"
                    onClick={() =>
                      void run(
                        () => saveEmergencyContact({ id: c.id, active: !c.active }),
                        c.active ? "Contact hidden." : "Contact visible.",
                        contacts.refresh,
                      )
                    }
                  >
                    {c.active ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive rounded-md"
                    onClick={() =>
                      void run(
                        () => deleteEmergencyContact(c.id),
                        "Contact removed.",
                        contacts.refresh,
                      )
                    }
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <PasswordChangeCard />
        </TabsContent>
      </Tabs>
    </section>
  );
}
