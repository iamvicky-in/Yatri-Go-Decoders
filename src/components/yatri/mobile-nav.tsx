import { Link } from "@tanstack/react-router";
import { Home, Compass, Sparkles, CalendarCheck, User } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/plan", label: "Plan", icon: Sparkles },
  { to: "/dashboard", label: "Bookings", icon: CalendarCheck },
  { to: "/login", label: "Profile", icon: User },
] as const;

export function MobileNav() {
  return (
    <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t-xl md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={label}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-accent" }}
              className="text-muted-foreground flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
