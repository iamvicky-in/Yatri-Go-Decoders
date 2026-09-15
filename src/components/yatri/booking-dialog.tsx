import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatINR, type Vendor } from "@/lib/yatri-data";
import { createBooking } from "@/lib/bookings-api";
import { googleMapsDirectionsUrl, googleMapsEmbedUrl } from "@/lib/vendors-api";
import { useAuth } from "@/lib/auth";
import { VerifiedBadge } from "./verified-badge";
import { Rating } from "./rating";

type Mode = "details" | "book";

const times = ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];

const isUuid = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export function VendorDialog({
  vendor,
  mode,
  onOpenChange,
}: {
  vendor: Vendor | null;
  mode: Mode;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(times[0]);
  const [qty, setQty] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (vendor) {
      setStep(mode === "book" ? 1 : 0);
      setBookingId("");
    }
  }, [vendor, mode]);

  useEffect(() => {
    const meta = user?.user_metadata as { full_name?: string } | undefined;
    if (meta?.full_name) setName((n) => n || meta.full_name!);
  }, [user]);

  if (!vendor) return null;
  const amount = Math.max(vendor.priceFrom, 1) * qty;
  const canContinue = step !== 1 || Boolean(date);
  const detailsValid = name.trim().length > 1 && phone.trim().length >= 10;

  return (
    <Dialog open={Boolean(vendor)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{step === 5 ? "Payment request created" : vendor.name}</DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <img
              src={vendor.image}
              alt={vendor.name}
              loading="lazy"
              width={800}
              height={600}
              className="h-44 w-full rounded-md object-cover"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Rating value={vendor.rating} reviews={vendor.reviews} />
              <VerifiedBadge verified={vendor.verified} />
            </div>
            <p className="text-muted-foreground text-sm">{vendor.description}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">Category</dt>
                <dd className="font-medium">{vendor.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Location</dt>
                <dd className="font-medium">{vendor.area}, {vendor.city}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Hours</dt>
                <dd className="font-medium">{vendor.hours}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Price range</dt>
                <dd className="font-medium">{vendor.priceRange}</dd>
              </div>
            </dl>
            <iframe
              title={`Map of ${vendor.name}`}
              src={googleMapsEmbedUrl(vendor)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full rounded-md border"
            />
            <a
              href={googleMapsDirectionsUrl(vendor)}
              target="_blank"
              rel="noreferrer"
              className="text-accent block text-sm font-semibold underline-offset-2 hover:underline"
            >
              Get directions in Google Maps
            </a>
            <Button className="w-full rounded-md" onClick={() => setStep(1)}>
              Book this service
            </Button>
          </div>
        )}

        {step > 0 && step < 5 && (
          <div className="space-y-5">
            <ol className="text-muted-foreground flex items-center gap-2 text-[11px] font-medium">
              {["Date & time", "Guests", "Details", "Payment"].map((label, i) => (
                <li
                  key={label}
                  className={
                    step === i + 1 ? "text-foreground font-semibold" : undefined
                  }
                >
                  {i + 1}. {label}
                </li>
              ))}
            </ol>

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bk-date">Select date</Label>
                  <Input
                    id="bk-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Select time</Label>
                  <div className="flex flex-wrap gap-2">
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={`rounded-sm border px-3 py-1.5 text-xs font-semibold ${
                          time === t ? "bg-primary text-primary-foreground border-transparent" : "bg-background"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <Label>Guests / quantity</Label>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" className="rounded-md" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </Button>
                  <span className="w-10 text-center text-lg font-semibold">{qty}</span>
                  <Button variant="outline" size="icon" className="rounded-md" onClick={() => setQty((q) => Math.min(20, q + 1))}>
                    +
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  Estimated amount: <span className="text-foreground font-semibold">{formatINR(amount)}</span>
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bk-name">Full name</Label>
                  <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-md" placeholder="Vicky Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bk-phone">Phone number</Label>
                  <Input id="bk-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md" placeholder="+91 98765 43210" />
                </div>
                {!detailsValid && (
                  <p className="text-muted-foreground text-xs">Enter your name and a 10-digit phone number to continue.</p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div className="bg-surface space-y-1.5 rounded-md p-4 text-sm">
                  <p className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{vendor.name}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{date || "—"}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{time}</span></p>
                  <p className="flex justify-between"><span className="text-muted-foreground">Guests</span><span className="font-medium">{qty}</span></p>
                  <p className="flex justify-between border-t pt-2"><span className="text-muted-foreground">Amount</span><span className="font-bold">{formatINR(amount)}</span></p>
                </div>
                <p className="text-muted-foreground text-xs">
                  Your amount is checked against the vendor’s confirmed price. Payment checkout will
                  become available after the payment catalog is approved.
                </p>
                {!user && (
                  <p className="text-destructive text-xs font-semibold">
                    Please sign in first — your booking is saved to your account.
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-between gap-2">
              <Button variant="ghost" className="rounded-md" onClick={() => setStep((s) => Math.max(mode === "book" ? 1 : 0, s - 1))}>
                Back
              </Button>
              <Button
                className="rounded-md"
                disabled={saving || !canContinue || (step === 3 && !detailsValid)}
                onClick={() => {
                  if (step !== 4) {
                    setStep((s) => s + 1);
                    return;
                  }
                  setSaving(true);
                  void createBooking({
                    vendorId: isUuid(vendor.id) ? vendor.id : null,
                    date,
                    time: time ?? times[0]!,
                    guests: qty,
                    customerName: name,
                    customerPhone: phone,
                  })
                    .then((booking) => {
                       setBookingId(booking.reference);
                      setStep(5);
                    })
                    .catch((err: unknown) => {
                      toast.error(
                        err instanceof Error ? err.message : "Could not save your booking.",
                      );
                    })
                    .finally(() => setSaving(false));
                }}
              >
                 {step === 4 ? (saving ? "Creating…" : "Create payment request") : "Continue"}
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="text-verified mx-auto size-14" />
            <div>
              <p className="text-muted-foreground text-xs">Booking ID</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-bold">{bookingId}</p>
            </div>
            <div className="bg-surface space-y-1.5 rounded-md p-4 text-left text-sm">
              <p className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{vendor.name}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Date & time</span><span className="font-medium">{date} · {time}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{vendor.area}, {vendor.city}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-medium">{formatINR(amount)}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Payment status</span><span className="text-budget font-semibold">Awaiting payment</span></p>
            </div>
            <Button className="w-full rounded-md" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
