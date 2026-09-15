import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { destinations, formatINR, type Destination } from "@/lib/yatri-data";
import { cn } from "@/lib/utils";

/**
 * Search-as-you-type destination field. Suggestions come from the
 * destinations data on the site and filter by name, state or tags.
 */
export function DestinationSearch({
  id,
  value,
  onChange,
  placeholder = "Where to?",
  className,
  inputClassName,
}: {
  id: string;
  value: string;
  onChange: (destination: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.bestFor.some((t) => t.toLowerCase().includes(q)),
    );
  }, [value]);

  useEffect(() => setHighlight(0), [matches.length]);

  // Close the dropdown when the user clicks anywhere outside it.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function pick(d: Destination) {
    onChange(d.name);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
        <Input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && matches.length > 0) {
              e.preventDefault();
              setOpen(true);
              setHighlight((h) => (h + 1) % matches.length);
            } else if (e.key === "ArrowUp" && matches.length > 0) {
              e.preventDefault();
              setHighlight((h) => (h - 1 + matches.length) % matches.length);
            } else if (e.key === "Enter" && open && matches[highlight]) {
              e.preventDefault();
              pick(matches[highlight]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className={cn("pl-9", inputClassName)}
        />
      </div>

      {open && (
        <ul
          id={`${id}-listbox`}
          role="listbox"
          className="bg-popover absolute z-50 mt-1.5 max-h-72 w-full overflow-auto rounded-md border shadow-md"
        >
          {matches.length === 0 && (
            <li className="text-muted-foreground px-3.5 py-3 text-sm">
              No places found for “{value}”. Try another city or state.
            </li>
          )}
          {matches.map((d, i) => (
            <li key={d.slug} role="option" aria-selected={inputMatches(value, d)}>
              <button
                type="button"
                onClick={() => pick(d)}
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  "flex w-full items-center gap-3 px-3.5 py-2.5 text-left",
                  i === highlight && "bg-secondary",
                )}
              >
                <MapPin className="text-primary size-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {d.name}, {d.state}
                  </span>
                  <span className="text-muted-foreground block truncate text-xs">
                    {d.bestFor.join(" · ")}
                  </span>
                </span>
                <span className="nums text-muted-foreground shrink-0 text-xs font-semibold">
                  from {formatINR(d.fromBudget)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function inputMatches(value: string, d: Destination) {
  return value.trim().toLowerCase() === d.name.toLowerCase();
}
