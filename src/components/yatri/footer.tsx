import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { useSiteContent } from "@/lib/admin-api";

const columns = [
  {
    title: "Travellers",
    links: [
      { to: "/plan", label: "Plan a Trip" },
      { to: "/explore", label: "Explore Destinations" },
      { to: "/services", label: "Services Near You" },
      { to: "/dashboard", label: "My Trips" },
    ],
  },
  {
    title: "Vendors",
    links: [
      { to: "/become-a-vendor", label: "List Your Business" },
      { to: "/how-it-works", label: "How It Works" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About YATRI GO" },
      { to: "/services", label: "Services" },
      { to: "/login", label: "Login / Sign Up" },
    ],
  },
] as const;

export function Footer() {
  const { text } = useSiteContent();
  return (
    <footer className="bg-primary text-primary-foreground mt-24 border-t-4 border-accent">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo invert className="w-52" />
          <p className="text-primary-foreground/70 max-w-xs text-sm">
            AI-powered travel planning and a verified local services network. Plan smarter, travel
            better.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-page text-primary-foreground/60 flex flex-col gap-2 border-t border-primary-foreground/15 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>{text("footer_note", "© 2026 YATRI GO | Decoders 2.0")}</p>
        <p>
          YATRI GO connects travellers with available local services. It does not replace official
          emergency authorities.
        </p>
      </div>
    </footer>
  );
}
