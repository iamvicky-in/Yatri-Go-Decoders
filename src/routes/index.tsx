import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Compass,
  IndianRupee,
  LifeBuoy,
  MapPinned,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import heroImg from "@/assets/hero-jaipur.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DestinationCard, ExperienceCard } from "@/components/yatri/cards";
import { MapView } from "@/components/yatri/map-view";
import { Reveal } from "@/components/yatri/reveal";
import { cultureExperiences, destinations, formatINR, vendors } from "@/lib/yatri-data";
import { DestinationSearch } from "@/components/yatri/destination-search";
import { travelStyles, todayISO, nextDay, dateProblem } from "@/lib/trip-engine";
import { toast } from "sonner";
import { useSiteContent } from "@/lib/admin-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YATRI GO — Your Trip. Your Budget. Your Way." },
      {
        name: "description",
        content:
          "YATRI GO uses AI to build smarter travel plans around your budget, interests and journey — and connects you with verified local services.",
      },
      { property: "og:title", content: "YATRI GO — Your Trip. Your Budget. Your Way." },
      {
        property: "og:description",
        content: "AI trip planning, smart budgeting and verified local services in one platform.",
      },
    ],
  }),
  component: Home,
});

const trust = [
  "AI-powered planning",
  "Budget-based recommendations",
  "Verified local vendors",
  "Travel services in one place",
];

const pillars = [
  {
    icon: Sparkles,
    title: "AI Trip Planning",
    body: "Build a personalized itinerary around your budget and interests.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Local Services",
    body: "Find trusted hotels, restaurants, mechanics, medical services and more.",
  },
  {
    icon: Wallet,
    title: "Smart Budgeting",
    body: "Know where your money goes before you travel.",
  },
  {
    icon: Compass,
    title: "Local Experiences",
    body: "Discover destinations through local culture, food and experiences.",
  },
  {
    icon: LifeBuoy,
    title: "Emergency Assistance",
    body: "Find nearby services when your journey doesn't go as planned.",
  },
];

function Home() {
  const navigate = useNavigate();
  const { text } = useSiteContent();
  const [destination, setDestination] = useState("Jaipur");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [budget, setBudget] = useState(10000);
  const [style, setStyle] = useState<string>("Culture");

  return (
    <>
      {/* Hero */}
      <section className="relative lg:pb-36">
        <div className="relative min-h-[31rem] overflow-hidden">
          <img
            src={heroImg}
            alt="Palace architecture at golden hour in Jaipur"
            width={1600}
            height={1000}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="container-page relative flex min-h-[31rem] flex-col items-center justify-center pb-20 text-center text-primary-foreground lg:pb-28">
            <span className="mb-5 inline-flex items-center gap-2 border-y border-primary-foreground/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]">
              <Compass className="size-4" /> {text("hero_eyebrow", "Plan Smarter. Travel Better.")}
            </span>
            <h1 className="max-w-4xl text-4xl leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">
              {text("hero_title", "Your trip, built around")}{" "}
              <span className="text-budget-foreground">
                {text("hero_title_accent", "your budget.")}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-primary-foreground/80 sm:text-lg">
              {text(
                "hero_subtitle",
                "A realistic day-by-day plan, trusted local services, and the freedom to travel India your way.",
              )}
            </p>
          </div>
        </div>

        <form
          className="surface-card container-page relative z-10 -mt-20 overflow-hidden border-0 p-0 shadow-lift lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (start && end) {
              const problem = dateProblem(start, end);
              if (problem) {
                toast.error(problem);
                return;
              }
            }
            navigate({
              to: "/plan",
              search: {
                destination,
                start: start || undefined,
                end: end || undefined,
                travellers,
                budget,
                style,
              },
            });
          }}
        >
          <div className="bg-primary flex items-center justify-between gap-4 px-5 py-3 text-primary-foreground sm:px-7">
            <div>
              <h2 className="text-base font-bold sm:text-lg">Build your journey</h2>
              <p className="text-xs text-primary-foreground/65">
                Tell us the essentials. We’ll shape the details.
              </p>
            </div>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/60 sm:block">
              30-second planner
            </span>
          </div>

          <div className="grid gap-px bg-border lg:grid-cols-[1.25fr_1.35fr_.8fr_.9fr_auto]">
            <div className="bg-card p-4 sm:p-5">
              <Label
                htmlFor="h-dest"
                className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.1em]"
              >
                Destination
              </Label>
              <DestinationSearch
                id="h-dest"
                value={destination}
                onChange={setDestination}
                placeholder="Where to?"
                className="mt-1"
                inputClassName="h-9 border-0 pl-7 text-base font-bold shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="bg-card p-4 sm:p-5">
              <Label className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">
                <CalendarDays className="size-3.5" /> Travel dates
              </Label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <Input
                  aria-label="Start date"
                  type="date"
                  min={todayISO()}
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                    if (end && end < e.target.value) setEnd(nextDay(e.target.value));
                  }}
                  className="h-9 border-0 px-0 text-sm shadow-none focus-visible:ring-0"
                />
                <Input
                  aria-label="End date"
                  type="date"
                  min={start || todayISO()}
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="h-9 border-0 px-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>
              {start && end && dateProblem(start, end) && (
                <p className="text-destructive mt-1 text-xs font-semibold">
                  {dateProblem(start, end)}
                </p>
              )}
            </div>

            <div className="bg-card p-4 sm:p-5">
              <Label className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em]">
                <Users className="size-3.5" /> Travellers
              </Label>
              <div className="mt-1 flex h-9 items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setTravellers((t) => Math.max(1, t - 1))}
                  aria-label="Remove traveller"
                >
                  −
                </Button>
                <span className="nums text-base font-bold">{travellers}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setTravellers((t) => Math.min(20, t + 1))}
                  aria-label="Add traveller"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="bg-card p-4 sm:p-5">
              <Label
                htmlFor="h-budget"
                className="text-muted-foreground text-[11px] font-bold uppercase tracking-[0.1em]"
              >
                Total budget
              </Label>
              <div className="mt-1 flex h-9 items-center gap-1">
                <IndianRupee className="text-accent size-4" />
                <Input
                  id="h-budget"
                  type="number"
                  min={2000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="h-9 border-0 px-0 text-base font-bold shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="bg-card p-3 sm:p-4">
              <Button
                type="submit"
                size="lg"
                className="h-full min-h-14 w-full bg-accent px-7 text-accent-foreground shadow-none hover:bg-accent/90 lg:min-w-40"
              >
                Build my trip <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex flex-wrap gap-2">
              {travelStyles.map((s) => (
                <Button
                  key={s}
                  type="button"
                  size="sm"
                  variant={style === s ? "default" : "ghost"}
                  onClick={() => setStyle(s)}
                  className="h-7 rounded-sm px-2.5 text-xs shadow-none"
                >
                  {s}
                </Button>
              ))}
            </div>
            <p className="text-muted-foreground nums shrink-0 text-xs">
              {formatINR(budget)} · {travellers} {travellers === 1 ? "traveller" : "travellers"}
            </p>
          </div>
        </form>
      </section>

      <section className="container-page py-10">
        <ul className="grid border-y sm:grid-cols-2 lg:grid-cols-4">
          {trust.map((item, index) => (
            <li
              key={item}
              className={`flex items-center gap-3 px-4 py-4 text-sm font-semibold ${index > 0 ? "sm:border-l" : ""}`}
            >
              <span className="nums text-accent text-xs font-bold">0{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Pillars */}
      <section className="container-page py-16 sm:py-20">
        <Reveal>
          <header className="max-w-2xl">
            <p className="kicker">Why Yatri Go</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">One Platform. Every Journey.</h2>
            <p className="text-muted-foreground mt-3">
              YATRI GO brings planning, budgeting, local discovery and on-road help into a single
              travel companion.
            </p>
          </header>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 70}>
              <article
                className={`surface-card card-hover h-full space-y-4 border-t-4 p-6 ${i === 0 ? "border-t-accent lg:col-span-2" : "border-t-primary"}`}
              >
                <span className="bg-secondary text-primary flex size-11 items-center justify-center rounded-md">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-bold">{title}</h3>
                <p className="text-muted-foreground text-sm">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Popular right now</h2>
              <p className="text-muted-foreground mt-2">Starting budgets are per person, all-in.</p>
            </div>
            <Button asChild variant="ghost" className="rounded-md">
              <Link to="/explore">
                See all destinations <ArrowRight className="size-4" />
              </Link>
            </Button>
          </header>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 6).map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}>
                <DestinationCard d={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Travel like a local */}
      <section className="container-page py-20">
        <Reveal>
          <header className="max-w-2xl">
            <p className="kicker">Travel Like a Local</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Culture, food and craft — from people who live there
            </h2>
            <p className="text-muted-foreground mt-3">
              Pick the themes you care about and YATRI AI builds them into your day plan.
            </p>
          </header>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cultureExperiences.slice(0, 3).map((e, i) => (
            <Reveal key={e.id} delay={i * 70}>
              <ExperienceCard e={e} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="bg-surface py-20">
        <div className="container-page">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-3xl font-bold sm:text-4xl">
                <MapPinned className="text-accent size-7" /> Everything around you, on one map
              </h2>
              <p className="text-muted-foreground mt-2">
                Hotels, food, transport, medical, mechanics and emergency desks — filtered by what
                you need.
              </p>
            </div>
            <Button asChild variant="secondary" className="rounded-md">
              <Link to="/services">Open Services Near You</Link>
            </Button>
          </header>
          <div className="mt-10">
            <MapView vendors={vendors} />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-page py-20">
        <div className="gradient-hero text-primary-foreground overflow-hidden rounded-lg border-l-8 border-accent px-8 py-14 sm:px-14">
          <h2 className="text-3xl font-bold sm:text-4xl">Travel with Confidence</h2>
          <p className="text-primary-foreground/80 mt-3 max-w-2xl">
            Every listing on YATRI GO goes through document, photo and video checks before it earns
            the verified badge.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Verified Vendors",
              "Transparent Pricing",
              "Reviews & Ratings",
              "AI Budget Planning",
              "Secure Booking",
              "Local Assistance",
            ].map((t) => (
              <li
                key={t}
                className="bg-background/10 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-medium"
              >
                <BadgeCheck className="text-verified size-5" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-budget text-budget-foreground hover:bg-budget/90 rounded-md"
            >
              <Link to="/plan">Plan My Trip</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-primary-foreground hover:text-foreground rounded-md border-white/40 bg-transparent"
            >
              <Link to="/become-a-vendor">List Your Business</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
