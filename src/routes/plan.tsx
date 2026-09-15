import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, RotateCcw, Sparkles } from "lucide-react";
import { downloadTripPlanPdf } from "@/lib/trip-pdf";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AIChat, type ChatMessage } from "@/components/yatri/ai-chat";
import { BudgetBreakdown, BudgetTracker } from "@/components/yatri/budget";
import { VendorDialog } from "@/components/yatri/booking-dialog";
import { ItineraryTimeline } from "@/components/yatri/itinerary";
import { MapView } from "@/components/yatri/map-view";
import { DashboardCard } from "@/components/yatri/cards";
import {
  applyInstruction,
  dateProblem,
  formatDateRange,
  generatePlan,
  todayISO,
  type TripInput,
} from "@/lib/trip-engine";
import { setPlan, usePlan } from "@/lib/trip-store";
import { formatINR, vendors, type Vendor } from "@/lib/yatri-data";
import {
  StepDestination,
  StepDates,
  StepTravellers,
  StepBudget,
  StepInterests,
  StepPreferences,
} from "@/components/plan/plan-steps";

type PlanSearch = {
  destination?: string | undefined;
  start?: string | undefined;
  end?: string | undefined;
  travellers?: number | undefined;
  budget?: number | undefined;
  style?: string | undefined;
};

export const Route = createFileRoute("/plan")({
  validateSearch: (search: Record<string, unknown>): PlanSearch => ({
    destination: typeof search["destination"] === "string" ? search["destination"] : undefined,
    start: typeof search["start"] === "string" ? search["start"] : undefined,
    end: typeof search["end"] === "string" ? search["end"] : undefined,
    travellers: Number(search["travellers"]) > 0 ? Number(search["travellers"]) : undefined,
    budget: Number(search["budget"]) > 0 ? Number(search["budget"]) : undefined,
    style: typeof search["style"] === "string" ? search["style"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Trip Planner — YATRI GO" },
      {
        name: "description",
        content:
          "Set your destination, dates, travellers, budget and interests. YATRI AI builds a day-by-day itinerary with costs and verified local vendors.",
      },
      { property: "og:title", content: "AI Trip Planner — YATRI GO" },
      {
        property: "og:description",
        content: "Budget-based itineraries you can edit by asking in plain language.",
      },
    ],
  }),
  component: PlanPage,
});

const stepTitles = ["Destination", "Dates", "Travellers", "Budget", "Interests", "Preferences"];

function defaultDates() {
  const start = new Date();
  start.setDate(start.getDate() + 21);
  const end = new Date(start);
  end.setDate(end.getDate() + 3);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function PlanPage() {
  const search = Route.useSearch();
  const plan = usePlan();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [dialogVendor, setDialogVendor] = useState<Vendor | null>(null);
  const [dialogMode, setDialogMode] = useState<"details" | "book">("details");
  const resultRef = useRef<HTMLDivElement>(null);
  const dates = useMemo(defaultDates, []);

  const [input, setInput] = useState<TripInput>({
    destination: search["destination"] ?? "Jaipur",
    startDate:
      search["start"] && search["start"] >= todayISO() ? search["start"] : dates.start,
    endDate: search["end"] && search["end"] >= todayISO() ? search["end"] : dates.end,
    travellers: search["travellers"] ?? 4,
    budget: search["budget"] ?? 10000,
    interests: search["style"] ? [search["style"]] : ["Culture", "Food", "History"],
    accommodation: "Mid-range",
    transport: "Cab",
    food: "Local Food",
    accommodations: ["Mid-range"],
    transports: ["Cab"],
    foods: ["Local Food"],
  });

  useEffect(() => {
    if (plan && chat.length === 0) {
      setChat([
        {
          role: "ai",
          text: `Here's your ${plan.input.destination} plan. Confirmed vendor prices total ${formatINR(plan.total)} with ${formatINR(Math.max(0, plan.remaining))} left. Unavailable prices are excluded.`,
        },
      ]);
    }
  }, [plan, chat.length]);

  function generate() {
    const problem = dateProblem(input.startDate, input.endDate);
    if (problem) {
      toast.error(problem);
      setStep(1);
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const next = generatePlan(input);
      setPlan(next);
      setChat([
        {
          role: "ai",
          text: `Based on approved vendors with confirmed prices, this ${next.nights}-night ${input.destination} plan totals ${formatINR(next.total)}. Items without a confirmed price are marked unavailable and excluded.`,
        },
      ]);
      setGenerating(false);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }));
    }, 900);
  }

  function handleChat(text: string) {
    if (!plan) return;
    setChat((c) => [...c, { role: "user", text }]);
    setGenerating(true);
    setTimeout(() => {
      const { plan: next, reply } = applyInstruction(plan, text);
      setPlan(next);
      setChat((c) => [...c, { role: "ai", text: reply }]);
      setGenerating(false);
    }, 800);
  }

  const budgetRows = plan
    ? [
        { label: "Accommodation", amount: plan.budget.accommodation },
        { label: "Food", amount: plan.budget.food },
        { label: "Transport", amount: plan.budget.transport },
        { label: "Activities", amount: plan.budget.activities },
        { label: "Contingency", amount: plan.budget.contingency },
      ]
    : [];

  const tripVendors = plan
    ? vendors.filter(
        (v) =>
          v.city.toLowerCase() === plan.input.destination.toLowerCase() ||
          v.category === "Emergency",
      )
    : vendors;

  return (
    <>
      <section className="bg-surface border-b py-12">
        <div className="container-page max-w-3xl">
          <span className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
            AI Trip Planner
          </span>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">
            Plan a trip that fits your budget
          </h1>
          <p className="text-muted-foreground mt-3">
            Six quick steps. You can change anything afterwards by simply asking YATRI AI.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="surface-card overflow-hidden">
          <div className="bg-surface flex flex-wrap gap-x-4 gap-y-1 border-b px-6 py-4 text-xs font-semibold">
            {stepTitles.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setStep(i)}
                className={
                  i === step ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }
              >
                {i + 1}. {t}
              </button>
            ))}
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            {step === 0 && <StepDestination input={input} setInput={setInput} />}
            {step === 1 && <StepDates input={input} setInput={setInput} />}
            {step === 2 && <StepTravellers input={input} setInput={setInput} />}
            {step === 3 && <StepBudget input={input} setInput={setInput} />}
            {step === 4 && <StepInterests input={input} setInput={setInput} />}
            {step === 5 && <StepPreferences input={input} setInput={setInput} />}

            <div className="flex items-center justify-between gap-3 border-t pt-6">
              <Button
                variant="ghost"
                className="rounded-md"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                <ArrowLeft className="size-4" /> Back
              </Button>
              {step < 5 ? (
                <Button className="rounded-md" onClick={() => setStep((s) => s + 1)}>
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button className="rounded-md" onClick={generate} disabled={generating}>
                  <Sparkles className="size-4" />
                  {generating ? "Generating your YATRI GO plan…" : "Generate my plan"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {generating && !plan && (
        <section className="container-page pb-12">
          <div className="surface-card animate-pulse p-10 text-center">
            <p className="font-semibold">Generating your YATRI GO plan…</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Balancing stay, food, transport and activities against your budget.
            </p>
          </div>
        </section>
      )}

      {plan && (
        <div ref={resultRef} className="bg-surface border-t py-14">
          <div className="container-page space-y-10">
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold uppercase sm:text-4xl">
                  {plan.input.destination}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {plan.nights} nights / {plan.days} days · {plan.input.travellers} travellers ·{" "}
                  {formatDateRange(plan.input.startDate, plan.input.endDate)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => {
                    setPlan(null);
                    setChat([]);
                    setStep(0);
                  }}
                >
                  <RotateCcw className="size-4" /> Start over
                </Button>
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => {
                    downloadTripPlanPdf(plan, tripVendors);
                    toast.success("Plan downloaded. It opens offline on your phone.");
                  }}
                >
                  <Download className="size-4" /> Download plan
                </Button>
                <Button
                  className="rounded-md"
                  onClick={() => toast.success("Plan saved to My Trips (prototype).")}
                >
                  Continue with this Plan
                </Button>
              </div>
            </header>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardCard label="Total budget" value={formatINR(plan.input.budget)} />
              <DashboardCard
                label="Confirmed-price total"
                value={formatINR(plan.total)}
                tone="budget"
              />
              <DashboardCard
                label="Remaining"
                value={formatINR(Math.max(0, plan.remaining))}
                tone="verified"
                hint={
                  plan.remaining < 0 ? "Over budget — ask YATRI AI to trim it" : "Buffer kept aside"
                }
              />
              <DashboardCard
                label="Hotel / night"
                value={formatINR(plan.budget.accommodation / plan.nights)}
                tone="budget"
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-10">
                <ItineraryTimeline
                  days={plan.itinerary}
                  onView={(v) => {
                    setDialogVendor(v);
                    setDialogMode("details");
                  }}
                  onBook={(v) => {
                    setDialogVendor(v);
                    setDialogMode("book");
                  }}
                />
                <MapView vendors={tripVendors} height="h-[400px]" />
              </div>

              <aside className="space-y-6">
                <div className="surface-card p-6">
                  <h3 className="mb-4 text-lg font-bold">Budget Breakdown</h3>
                  <BudgetBreakdown rows={budgetRows} total={plan.input.budget} />
                </div>
                <div className="surface-card p-6">
                  <h3 className="mb-4 text-lg font-bold">Trip Wallet</h3>
                  <BudgetTracker budget={plan.input.budget} spent={plan.total} />
                </div>
                <div className="surface-card overflow-hidden">
                  <div className="bg-primary px-6 py-4 text-primary-foreground">
                    <h3 className="font-bold">YATRI AI Assistant</h3>
                    <p className="text-primary-foreground/70 text-xs">Ask me to change your plan</p>
                  </div>
                  <AIChat messages={chat} onSend={handleChat} busy={generating} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}

      {dialogVendor && (
        <VendorDialog
          vendor={dialogVendor}
          mode={dialogMode}
          onOpenChange={(open) => !open && setDialogVendor(null)}
        />
      )}
    </>
  );
}
