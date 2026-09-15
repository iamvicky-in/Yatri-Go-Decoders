import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VerifiedBadge } from "@/components/yatri/verified-badge";
import { signedMediaUrls, type VendorRow } from "@/lib/vendors-api";
import type { VendorPatch, ServiceOfferingRow, EmergencyContactRow } from "@/lib/admin-api";

/** Change the password of the signed-in admin account. */
export function PasswordChangeCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("The two new passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: next,
        current_password: current,
      } as { password: string; current_password: string });
      if (error) throw error;
      toast.success("Password updated.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface-card max-w-md space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold">Change your password</h2>
        <p className="text-muted-foreground text-sm">
          Applies to the account you are signed in with.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cur-pass">Current password</Label>
        <Input
          id="cur-pass"
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new-pass">New password</Label>
        <Input
          id="new-pass"
          type="password"
          required
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new-pass2">Repeat new password</Label>
        <Input
          id="new-pass2"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-md"
        />
      </div>
      <Button type="submit" className="rounded-md" disabled={busy}>
        {busy ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}

export function ContentRow({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div className="space-y-2 p-5">
      <Label className="text-xs font-semibold uppercase tracking-wide">{label}</Label>
      <Textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        className="rounded-md"
      />
      <Button
        size="sm"
        className="rounded-md"
        disabled={draft === value}
        onClick={() => onSave(draft)}
      >
        Save
      </Button>
    </div>
  );
}

export function ServiceEditor({ onSave }: { onSave: (row: Partial<ServiceOfferingRow>) => void }) {
  const [row, setRow] = useState({
    title: "",
    category: "Activity",
    city: "",
    description: "",
    price_from: 0,
  });
  return (
    <form
      className="surface-card grid gap-4 p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!row.title.trim()) return;
        onSave(row);
        setRow({ title: "", category: "Activity", city: "", description: "", price_from: 0 });
      }}
    >
      <div className="space-y-1.5">
        <Label>Service name</Label>
        <Input
          value={row.title}
          onChange={(e) => setRow({ ...row, title: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Input
          value={row.category}
          onChange={(e) => setRow({ ...row, category: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>City</Label>
        <Input
          value={row.city}
          onChange={(e) => setRow({ ...row, city: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Starting price (₹)</Label>
        <Input
          type="number"
          min={0}
          value={row.price_from}
          onChange={(e) => setRow({ ...row, price_from: Number(e.target.value) })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Description</Label>
        <Textarea
          value={row.description}
          onChange={(e) => setRow({ ...row, description: e.target.value })}
          rows={2}
          className="rounded-md"
        />
      </div>
      <Button type="submit" className="rounded-md sm:w-40">
        Add service
      </Button>
    </form>
  );
}

export function ContactEditor({ onSave }: { onSave: (row: Partial<EmergencyContactRow>) => void }) {
  const [row, setRow] = useState({
    label: "",
    name: "",
    phone: "",
    city: "All India",
    category: "Helpline",
  });
  return (
    <form
      className="surface-card grid gap-4 p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!row.label.trim() || !row.phone.trim()) return;
        onSave(row);
        setRow({ label: "", name: "", phone: "", city: "All India", category: "Helpline" });
      }}
    >
      <div className="space-y-1.5">
        <Label>Label</Label>
        <Input
          value={row.label}
          onChange={(e) => setRow({ ...row, label: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Phone number</Label>
        <Input
          value={row.phone}
          onChange={(e) => setRow({ ...row, phone: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Organisation</Label>
        <Input
          value={row.name}
          onChange={(e) => setRow({ ...row, name: e.target.value })}
          className="rounded-md"
        />
      </div>
      <div className="space-y-1.5">
        <Label>City</Label>
        <Input
          value={row.city}
          onChange={(e) => setRow({ ...row, city: e.target.value })}
          className="rounded-md"
        />
      </div>
      <Button type="submit" className="rounded-md sm:w-40">
        Add contact
      </Button>
    </form>
  );
}

/** Admin shortcut for adding a listing that goes live immediately. */
export function VendorCreateForm({
  onSave,
}: {
  onSave: (row: {
    name: string;
    category: string;
    city: string;
    area: string;
    phone: string;
    price_from: number;
    price_range: string;
    hours: string;
    description: string;
    lat: number;
    lng: number;
  }) => void;
}) {
  const empty = {
    name: "",
    category: "Hotel",
    city: "",
    area: "",
    phone: "",
    price_from: 0,
    price_range: "",
    hours: "9:00 AM – 9:00 PM",
    description: "",
    lat: 26.9124,
    lng: 75.7873,
  };
  const [row, setRow] = useState(empty);
  return (
    <form
      className="surface-card grid gap-4 p-5 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!row.name.trim() || !row.city.trim()) return;
        onSave(row);
        setRow(empty);
      }}
    >
      <p className="text-sm font-bold sm:col-span-2">Add a listing yourself</p>
      {(
        [
          ["name", "Business name", "text"],
          ["category", "Category", "text"],
          ["city", "City", "text"],
          ["area", "Area", "text"],
          ["phone", "Phone", "text"],
          ["price_range", "Price range", "text"],
          ["hours", "Opening hours", "text"],
          ["price_from", "Starting price (₹)", "number"],
          ["lat", "Latitude", "number"],
          ["lng", "Longitude", "number"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key} className="space-y-1.5">
          <Label>{label}</Label>
          <Input
            type={type}
            value={row[key]}
            onChange={(e) =>
              setRow({ ...row, [key]: type === "number" ? Number(e.target.value) : e.target.value })
            }
            className="rounded-md"
          />
        </div>
      ))}
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Description</Label>
        <Textarea
          rows={2}
          value={row.description}
          onChange={(e) => setRow({ ...row, description: e.target.value })}
          className="rounded-md"
        />
      </div>
      <Button type="submit" className="rounded-md sm:w-40">
        Add listing
      </Button>
    </form>
  );
}

/** Everything the verification team needs to judge a business, media included. */
export function VendorDetails({ vendor }: { vendor: VendorRow }) {
  const [media, setMedia] = useState<{ path: string; url: string }[]>([]);
  const [video, setVideo] = useState<string>("");

  useEffect(() => {
    let active = true;
    void signedMediaUrls(vendor.photo_urls ?? []).then((m) => active && setMedia(m));
    void signedMediaUrls(vendor.video_url ? [vendor.video_url] : []).then(
      (m) => active && setVideo(m[0]?.url ?? ""),
    );
    return () => {
      active = false;
    };
  }, [vendor.photo_urls, vendor.video_url]);

  const facts: [string, string][] = [
    ["Owner", vendor.owner_name || "Not provided"],
    ["Owner email", vendor.owner_email || "Not provided"],
    ["Phone", vendor.phone || "Not provided"],
    ["GST / registration", vendor.registration_id || "Not provided"],
    ["Category", vendor.category],
    ["Address", [vendor.area, vendor.city].filter(Boolean).join(", ") || "Not provided"],
    ["Opening hours", vendor.hours || "Not provided"],
    ["Pricing", vendor.price_range || "Not provided"],
    ["Starting price", vendor.price_from ? `₹${vendor.price_from}` : "Not confirmed"],
    ["Map location", `${Number(vendor.lat).toFixed(5)}, ${Number(vendor.lng).toFixed(5)}`],
    ["Submitted", new Date(vendor.created_at).toLocaleString("en-IN")],
    ["Status", `${vendor.status}${vendor.verified ? " · verified" : ""}`],
  ];

  return (
    <div className="bg-secondary/40 mt-4 space-y-5 rounded-md p-5">
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {facts.map(([k, v]) => (
          <div key={k}>
            <p className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">
              {k}
            </p>
            <p className="text-sm font-medium break-words">{v}</p>
          </div>
        ))}
      </div>

      {vendor.description && (
        <div>
          <p className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">
            Description &amp; services
          </p>
          <p className="mt-1 text-sm whitespace-pre-line">{vendor.description}</p>
        </div>
      )}

      <div>
        <p className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">
          Business photos
        </p>
        {media.length === 0 ? (
          <p className="text-muted-foreground mt-1 text-sm">No photos uploaded.</p>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {media.map((m) => (
              <a key={m.path} href={m.url} target="_blank" rel="noreferrer">
                <img
                  src={m.url}
                  alt={`${vendor.name} business photo`}
                  className="h-28 w-full rounded-md object-cover"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-muted-foreground text-[11px] font-bold tracking-wide uppercase">
          Verification video
        </p>
        {video ? (
          <video src={video} controls className="mt-2 w-full max-w-md rounded-md" />
        ) : (
          <p className="text-muted-foreground mt-1 text-sm">No video uploaded.</p>
        )}
      </div>

      <a
        className="text-accent inline-block text-sm font-semibold"
        href={`https://www.google.com/maps?q=${vendor.lat},${vendor.lng}`}
        target="_blank"
        rel="noreferrer"
      >
        Open this location on the map →
      </a>
    </div>
  );
}

export function VendorRowEditor({
  vendor,
  onSave,
  onDelete,
}: {
  vendor: VendorRow;
  onSave: (patch: VendorPatch) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [notes, setNotes] = useState(vendor.verification_notes ?? "");
  const [draft, setDraft] = useState({
    name: vendor.name,
    category: vendor.category,
    city: vendor.city,
    area: vendor.area,
    phone: vendor.phone,
    price_from: vendor.price_from,
    price_range: vendor.price_range,
    hours: vendor.hours,
    description: vendor.description,
  });

  return (
    <div className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold">{vendor.name}</p>
          <p className="text-muted-foreground text-xs">
            {vendor.category} · {vendor.area ? `${vendor.area}, ` : ""}
            {vendor.city} · {vendor.status}
            {vendor.photo_urls?.length ? ` · ${vendor.photo_urls.length} photos` : ""}
            {vendor.video_url ? " · video" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <VerifiedBadge verified={vendor.verified} />
          <Button
            size="sm"
            variant="outline"
            className="rounded-md"
            onClick={() => setDetails((d) => !d)}
          >
            {details ? "Hide details" : "View details"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-md"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-md"
            onClick={() => onSave({ verified: !vendor.verified })}
          >
            {vendor.verified ? "Remove verified" : "Mark verified"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-md"
            onClick={() => onSave({ open_now: !vendor.open_now })}
          >
            {vendor.open_now ? "Set closed" : "Set open"}
          </Button>
          {vendor.status !== "approved" && (
            <Button
              size="sm"
              className="rounded-md"
              onClick={() => onSave({ status: "approved", verified: true })}
            >
              Approve
            </Button>
          )}
          {vendor.status === "approved" && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-md"
              onClick={() => onSave({ status: "pending", verified: false })}
            >
              Unpublish
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive rounded-md"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {details && (
        <>
          <VendorDetails vendor={vendor} />
          <div className="mt-4 space-y-2">
            <Label>Verification notes (internal)</Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-md"
            />
            <Button
              size="sm"
              className="rounded-md"
              disabled={notes === (vendor.verification_notes ?? "")}
              onClick={() => onSave({ verification_notes: notes })}
            >
              Save notes
            </Button>
          </div>
        </>
      )}

      {open && (
        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
            setOpen(false);
          }}
        >
          {(
            [
              ["name", "Business name"],
              ["category", "Category"],
              ["city", "City"],
              ["area", "Area"],
              ["phone", "Phone"],
              ["price_range", "Price range"],
              ["hours", "Opening hours"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                value={draft[key]}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                className="rounded-md"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label>Starting price (₹)</Label>
            <Input
              type="number"
              min={0}
              value={draft.price_from}
              onChange={(e) => setDraft({ ...draft, price_from: Number(e.target.value) })}
              className="rounded-md"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="rounded-md"
            />
          </div>
          <Button type="submit" className="rounded-md sm:w-40">
            Save changes
          </Button>
        </form>
      )}
    </div>
  );
}
