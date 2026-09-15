import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./brand";
import { signOut, useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan a Trip" },
  { to: "/explore", label: "Explore" },
  { to: "/services", label: "Services" },
  { to: "/become-a-vendor", label: "Become a Vendor" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, isVendor } = useAuth();

  const dashboardLink = isAdmin
    ? { to: "/admin", label: "Admin Console" }
    : isVendor
      ? { to: "/vendor-dashboard", label: "Vendor Dashboard" }
      : { to: "/dashboard", label: "My Trips" };

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="text-muted-foreground hover:text-foreground rounded-sm px-3 py-2 text-sm font-semibold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to={dashboardLink.to as any}>{dashboardLink.label}</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => {
                  void signOut();
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md shadow-none"
          >
            <Link to="/plan">Plan My Trip</Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="hover:bg-secondary rounded-md p-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-background border-t lg:hidden">
          <nav className="container-page grid gap-1 py-3">
            {[...links, { to: "/login", label: "Login / Sign Up" } as const].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="hover:bg-secondary rounded-md px-3 py-2.5 text-sm font-medium"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
