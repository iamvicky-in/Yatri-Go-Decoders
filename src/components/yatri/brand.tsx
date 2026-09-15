import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/yatri-go-logo.png.asset.json";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="YATRI GO home"
      className={cn(
        "group block w-[9.75rem] shrink-0 rounded-md transition-opacity hover:opacity-90 sm:w-[11.5rem]",
        invert && "bg-card p-2",
        className,
      )}
    >
      <img
        src={logoAsset.url}
        alt="YATRI GO — Plan Smarter and Travel Better"
        width={805}
        height={247}
        className="block h-auto w-full"
      />
    </Link>
  );
}
