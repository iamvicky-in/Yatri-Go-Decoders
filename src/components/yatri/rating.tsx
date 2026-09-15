import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  reviews,
  className,
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <Star className="size-4 fill-budget text-budget" />
      {value.toFixed(1)}
      {reviews !== undefined && (
        <span className="text-muted-foreground font-normal">({reviews.toLocaleString("en-IN")})</span>
      )}
    </span>
  );
}
