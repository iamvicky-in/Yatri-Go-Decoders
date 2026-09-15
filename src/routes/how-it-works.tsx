import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How YATRI GO Works — Plan, Discover, Book" },
      {
        name: "description",
        content:
          "Four steps: tell us your plan, let AI build the trip, discover verified local services, then book and travel from one dashboard.",
      },
      { property: "og:title", content: "How YATRI GO Works" },
      {
        property: "og:description",
        content: "From budget and dates to a booked, verified itinerary in four steps.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    n: "01",
    title: "Tell Us Your Plan",
    body: "Destination, budget, dates and preferences — culture, food, stay tier and how you like to travel.",
  },
  {
    n: "02",
    title: "AI Builds Your Trip",
    body: "YATRI GO creates a personalized itinerary with a realistic cost for every stop.",
  },
  {
    n: "03",
    title: "Discover Verified Services",
    body: "Find hotels, food, transport, mechanics, medical services and activities near your route.",
  },
  {
    n: "04",
    title: "Book & Travel",
    body: "Book services and manage your entire trip, budget and bookings from one dashboard.",
  },
];

function HowItWorks() {
  return (
    <>
      <section className="container-page py-16">
        <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">
          From a budget to a booked trip in four steps
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          The whole point of YATRI GO is that you never have to open ten tabs to plan a weekend.
        </p>

        <ol className="mt-12 grid gap-6 md:grid-cols-2">
          {steps.map((s) => (
            <li key={s.n} className="surface-card p-7">
              <span className="text-accent font-[family-name:var(--font-display)] text-4xl font-extrabold">
                {s.n}
              </span>
              <h2 className="mt-3 text-xl font-bold">{s.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-7">
            <h2 className="text-xl font-bold">For travellers</h2>
            <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
              <li>• Budget-first planning — you see costs before you commit.</li>
              <li>• Edit the plan by asking, not by rebuilding it.</li>
              <li>• Verified vendors with transparent pricing and real reviews.</li>
              <li>• Emergency and roadside services pinned on your route map.</li>
            </ul>
          </div>
          <div className="surface-card p-7">
            <h2 className="text-xl font-bold">For vendors</h2>
            <ul className="text-muted-foreground mt-4 space-y-2.5 text-sm">
              <li>• Free listing, paid visibility only if you want it.</li>
              <li>• Verification badge after photo, document and video checks.</li>
              <li>• Enquiries and bookings from travellers already in your city.</li>
              <li>• A dashboard for pricing, availability and reviews.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-md">
            <Link to="/plan">Plan My Trip</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-md">
            <Link to="/become-a-vendor">List Your Business</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
