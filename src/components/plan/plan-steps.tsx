import { Check, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { destinations, formatINR } from "@/lib/yatri-data";
import { DestinationSearch } from "@/components/yatri/destination-search";
import {
  todayISO,
  nextDay,
  dateProblem,
  interestOptions,
  accommodationOptions,
  transportOptions,
  foodOptions,
  formatDateRange,
  type TripInput,
} from "@/lib/trip-engine";

export function StepDestination({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  return (
    <div className="space-y-4">
      <Label htmlFor="p-dest" className="text-base font-semibold">
        Where are you going?
      </Label>
      <DestinationSearch
        id="p-dest"
        value={input.destination}
        onChange={(destination) => setInput({ ...input, destination })}
        placeholder="e.g. Jaipur"
        inputClassName="h-12 rounded-md"
      />
      <div className="flex flex-wrap gap-2">
        {destinations.map((d) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => setInput({ ...input, destination: d.name })}
            className={`rounded-sm border px-3.5 py-1.5 text-xs font-semibold ${
              input.destination === d.name
                ? "bg-primary text-primary-foreground border-transparent"
                : "hover:bg-secondary"
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepDates({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  const today = todayISO();
  const problem = dateProblem(input.startDate, input.endDate);

  function changeStart(value: string) {
    // Keep the end date valid whenever the start date moves forward.
    const endDate = !input.endDate || input.endDate <= value ? nextDay(value) : input.endDate;
    setInput({ ...input, startDate: value, endDate });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="p-start">Start date</Label>
        <Input
          id="p-start"
          type="date"
          min={today}
          value={input.startDate}
          onChange={(e) => changeStart(e.target.value)}
          className="h-12 rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="p-end">End date</Label>
        <Input
          id="p-end"
          type="date"
          min={input.startDate || today}
          value={input.endDate}
          onChange={(e) => setInput({ ...input, endDate: e.target.value })}
          className="h-12 rounded-md"
        />
      </div>
      {problem ? (
        <p className="text-destructive text-sm font-semibold sm:col-span-2">{problem}</p>
      ) : (
        <p className="text-muted-foreground text-sm sm:col-span-2">
          {formatDateRange(input.startDate, input.endDate)}
        </p>
      )}
    </div>
  );
}

export function StepTravellers({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">How many travellers?</Label>
      <div className="flex items-center gap-5">
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-full text-xl"
          onClick={() => setInput({ ...input, travellers: Math.max(1, input.travellers - 1) })}
        >
          −
        </Button>
        <span className="font-[family-name:var(--font-display)] w-12 text-center text-3xl font-bold">
          {input.travellers}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-full text-xl"
          onClick={() => setInput({ ...input, travellers: Math.min(20, input.travellers + 1) })}
        >
          +
        </Button>
      </div>
    </div>
  );
}

export function StepBudget({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  return (
    <div className="space-y-4">
      <Label htmlFor="p-budget" className="text-base font-semibold">
        Total budget for the trip
      </Label>
      <div className="flex items-center gap-2 rounded-md border px-4">
        <IndianRupee className="text-muted-foreground size-5" />
        <Input
          id="p-budget"
          type="number"
          min={2000}
          step={500}
          value={input.budget}
          onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })}
          className="h-12 border-0 px-1 text-lg font-semibold shadow-none focus-visible:ring-0"
        />
      </div>
      <input
        type="range"
        min={3000}
        max={100000}
        step={500}
        value={Math.min(100000, input.budget)}
        onChange={(e) => setInput({ ...input, budget: Number(e.target.value) })}
        className="accent-accent w-full"
      />
      <p className="text-muted-foreground text-sm">
        That's about{" "}
        <span className="text-foreground font-semibold">
          {formatINR(input.budget / Math.max(1, input.travellers))}
        </span>{" "}
        per traveller.
      </p>
    </div>
  );
}

export function StepInterests({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  function toggleInterest(i: string) {
    setInput((prev) => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter((x) => x !== i)
        : [...prev.interests, i],
    }));
  }
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">What are you interested in?</Label>
      <div className="flex flex-wrap gap-2">
        {interestOptions.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleInterest(i)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold transition-colors ${
              input.interests.includes(i)
                ? "bg-accent text-accent-foreground border-transparent"
                : "hover:bg-secondary"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepPreferences({
  input,
  setInput,
}: {
  input: TripInput;
  setInput: React.Dispatch<React.SetStateAction<TripInput>>;
}) {
  function toggle<K extends "accommodation" | "transport" | "food">(
    key: K,
    listKey: "accommodations" | "transports" | "foods",
    option: string,
  ) {
    const current = (input[listKey] ?? [input[key]]) as string[];
    const next = current.includes(option)
      ? current.filter((x) => x !== option)
      : [...current, option];
    // Keep at least one selection; the last one chosen drives pricing.
    if (next.length === 0) return;
    setInput({ ...input, [listKey]: next, [key]: next[next.length - 1] });
  }

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Pick one or more options in each group. Your last pick sets the budget style.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        <ChoiceGroup
          label="Accommodation"
          options={accommodationOptions}
          values={input.accommodations ?? [input.accommodation]}
          onToggle={(v) => toggle("accommodation", "accommodations", v)}
        />
        <ChoiceGroup
          label="Transportation"
          options={transportOptions}
          values={input.transports ?? [input.transport]}
          onToggle={(v) => toggle("transport", "transports", v)}
        />
        <ChoiceGroup
          label="Food"
          options={foodOptions}
          values={input.foods ?? [input.food]}
          onToggle={(v) => toggle("food", "foods", v)}
        />
      </div>
    </div>
  );
}

function ChoiceGroup({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  values: readonly string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-bold uppercase tracking-wide">{label}</Label>
      <div className="grid gap-2">
        {options.map((o) => {
          const selected = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(o)}
              className={`flex items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                selected
                  ? "bg-accent text-accent-foreground border-transparent"
                  : "hover:bg-secondary"
              }`}
            >
              {o}
              {selected && <Check className="size-4" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
