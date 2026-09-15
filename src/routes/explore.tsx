import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DestinationCard, ExperienceCard, EmptyState } from "@/components/yatri/cards";
import { cultureExperiences, destinations } from "@/lib/yatri-data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Destinations — YATRI GO" },
      {
        name: "description",
        content:
          "Discover Jaipur, Goa, Manali, Rishikesh, Varanasi, Udaipur and Kerala with starting budgets, best-for tags and local experiences.",
      },
      { property: "og:title", content: "Explore Destinations — YATRI GO" },
      {
        property: "og:description",
        content: "Destination ideas with realistic starting budgets and local experiences.",
      },
    ],
  }),
  component: Explore,
});

const themes = [
  "All",
  "Culture",
  "Food",
  "Adventure",
  "Nature",
  "Spiritual",
  "Beaches",
  "History",
  "Family",
  "Nightlife",
  "Photography",
];

function Explore() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("All");

  const results = destinations.filter((d) => {
    const matchesQuery =
      !query ||
      `${d.name} ${d.state} ${d.bestFor.join(" ")} ${d.experiences.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase());
    const matchesTheme = theme === "All" || d.bestFor.includes(theme);
    return matchesQuery && matchesTheme;
  });

  return (
    <>
      <section className="bg-surface border-b py-14">
        <div className="container-page max-w-3xl space-y-5">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Where will you go next?</h1>
          <p className="text-muted-foreground">
            Browse destinations by budget and interest, then hand it to YATRI AI to build the days.
          </p>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “Rajasthan”, “beaches” or “Varanasi”"
            className="h-12 rounded-md"
          />
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`rounded-sm border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  theme === t
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-background hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((d) => (
              <DestinationCard key={d.slug} d={d} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No destinations match that yet"
            body="Try a different interest or clear the search — we're adding new cities every month."
          />
        )}
      </section>

      <section className="bg-surface py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold">Travel Like a Local</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Culture, food, festivals, history, markets, art and community-run experiences — all
            bookable inside your itinerary.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cultureExperiences.map((e) => (
              <ExperienceCard key={e.id} e={e} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
