import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About YATRI GO — Making Every Journey Simpler." },
      {
        name: "description",
        content:
          "YATRI GO combines AI-powered travel planning with a network of local service providers so travellers can plan, discover and manage journeys from one platform.",
      },
      { property: "og:title", content: "About YATRI GO" },
      {
        property: "og:description",
        content: "Why we built an AI planner and a verified local services network together.",
      },
    ],
  }),
  component: About,
});

const blocks = [
  {
    title: "Our Mission",
    body: "Make travel planning honest about money. Most trips in India fail on budget, not on ideas — so YATRI GO starts from what you can spend and works backwards to a realistic plan.",
  },
  {
    title: "How YATRI GO Works",
    body: "You share your destination, dates, group size, budget and interests. Our planner builds a day-by-day itinerary with costs, then matches each stop to verified local vendors you can actually book.",
  },
  {
    title: "Why We Built It",
    body: "Travellers already trust local hotels, dhabas, cab drivers and mechanics — they just can't find the good ones in time. Small businesses have no easy way to be discovered by the travellers passing through.",
  },
  {
    title: "Future Vision",
    body: "Route-aware assistance across India: live budget tracking, offline-friendly itineraries, regional language support and verified services on every highway corridor.",
  },
];

function About() {
  return (
    <section className="container-page py-16">
      <h1 className="max-w-3xl text-4xl font-extrabold sm:text-5xl">
        Making Every Journey Simpler.
      </h1>
      <p className="text-muted-foreground mt-5 max-w-3xl text-lg">
        YATRI GO combines AI-powered travel planning with a network of local service providers so
        travellers can plan, discover, and manage their journeys from one platform.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <article key={b.title} className="surface-card p-7">
            <h2 className="text-xl font-bold">{b.title}</h2>
            <p className="text-muted-foreground mt-3 text-sm">{b.body}</p>
          </article>
        ))}
      </div>

      <div className="bg-surface mt-12 grid gap-6 rounded-md p-8 sm:grid-cols-3">
        {[
          { k: "7", v: "Destinations live in this build" },
          { k: "10+", v: "Sample verified vendors" },
          { k: "8", v: "Service categories on the map" },
        ].map((s) => (
          <div key={s.k}>
            <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold">{s.k}</p>
            <p className="text-muted-foreground mt-1 text-sm">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild size="lg" className="rounded-md">
          <Link to="/plan">Plan My Trip</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-md">
          <Link to="/explore">Explore Destinations</Link>
        </Button>
      </div>
    </section>
  );
}
