import { BadgeCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  verified,
  className,
  label,
}: {
  verified: boolean;
  className?: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[11px] font-semibold",
        verified
          ? "bg-verified-soft text-verified"
          : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {verified ? <BadgeCheck className="size-3.5" /> : <Clock className="size-3.5" />}
      {label ?? (verified ? "YATRI GO Verified" : "Verification pending")}
    </span>
  );
}
