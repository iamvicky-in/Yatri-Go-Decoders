import { destinations, vendors, type Vendor } from "./yatri-data";

/**
 * Prototype recommendation engine.
 *
 * This is a deterministic, fully local planner so the prototype always produces
 * a realistic result. When a model-backed backend is added, swap `generatePlan`
 * and `applyInstruction` for server calls — the returned `TripPlan` shape is the
 * contract the whole UI renders against.
 */

export type Accommodation = "Budget" | "Mid-range" | "Premium";
export type Transport = "Public Transport" | "Cab" | "Rental Vehicle" | "Own Vehicle";
export type FoodStyle = "Local Food" | "Restaurant" | "Street Food" | "Cloud Kitchen / Delivery";

export type TripInput = {
  destination: string;
  startDate: string;
  endDate: string;
  travellers: number;
  budget: number;
  interests: string[];
  accommodation: Accommodation;
  transport: Transport;
  food: FoodStyle;
  // Multi-select preference lists. The singular fields above always mirror the
  // last selected item so pricing logic keeps working with a single value.
  accommodations?: Accommodation[];
  transports?: Transport[];
  foods?: FoodStyle[];
};

export type Activity = {
  time: string;
  title: string;
  note: string;
  cost: number;
  priceConfirmed: boolean;
  distanceKm: number;
  travelMins: number;
  vendorId?: string | undefined;
  category: "Stay" | "Food" | "Transport" | "Activity" | "Shopping" | "Other";
};

export type TripDay = { day: number; title: string; activities: Activity[] };

export type TripPlan = {
  input: TripInput;
  nights: number;
  days: number;
  budget: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    contingency: number;
  };
  total: number;
  remaining: number;
  perNightHotel: number;
  perPersonPerDayFood: number;
  itinerary: TripDay[];
  notes: string[];
};

export const interestOptions = [
  "Culture",
  "Food",
  "Adventure",
  "Shopping",
  "History",
  "Nature",
  "Spiritual",
  "Nightlife",
  "Family",
  "Photography",
];

export const accommodationOptions: Accommodation[] = ["Budget", "Mid-range", "Premium"];
export const transportOptions: Transport[] = [
  "Public Transport",
  "Cab",
  "Rental Vehicle",
  "Own Vehicle",
];
export const foodOptions: FoodStyle[] = [
  "Local Food",
  "Restaurant",
  "Street Food",
  "Cloud Kitchen / Delivery",
];

export const travelStyles = [
  "Culture",
  "Adventure",
  "Relaxation",
  "Family",
  "Business",
  "Food",
] as const;

/** Today as YYYY-MM-DD, used as the earliest selectable travel date. */
export function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

/** The day after the given YYYY-MM-DD date. */
export function nextDay(date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  d.setDate(d.getDate() + 1);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/** Human-readable reason the chosen dates cannot be used, or null when they are fine. */
export function dateProblem(start: string, end: string): string | null {
  if (!start || !end) return "Please choose both a start and an end date.";
  const today = todayISO();
  if (start < today) return "Travel dates cannot start in the past. Pick today or a later date.";
  if (end < start) return "The end date must be on or after the start date.";
  return null;
}

export function nightsBetween(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (!start || !end || Number.isNaN(a) || Number.isNaN(b) || b <= a) return 3;
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

export function formatDateRange(start: string, end: string) {
  const fmt = (v: string) =>
    new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  if (!start || !end) return "Dates to be confirmed";
  return `${fmt(start)} – ${fmt(end)}`;
}

function pickVendor(city: string, category: Vendor["category"]) {
  return vendors.find(
    (v) =>
      v.city.toLowerCase() === city.toLowerCase() &&
      v.category === category &&
      v.verified &&
      v.priceFrom > 0,
  );
}

export function generatePlan(input: TripInput): TripPlan {
  const nights = nightsBetween(input.startDate, input.endDate);
  const days = nights + 1;
  const budget = Math.max(2000, input.budget);

  const hotel = pickVendor(input.destination, "Hotel");
  const restaurant = pickVendor(input.destination, "Restaurant");
  const cab = pickVendor(input.destination, "Transport");
  const activityVendor = pickVendor(input.destination, "Activity");
  const mealVendor =
    input.food === "Cloud Kitchen / Delivery"
      ? (pickVendor(input.destination, "Cloud Kitchen") ?? restaurant)
      : restaurant;
  const perNightHotel = hotel?.priceFrom ?? 0;
  const perPersonPerDayFood = mealVendor?.priceFrom ? mealVendor.priceFrom * 2 : 0;
  const stayTotal = perNightHotel * nights;

  const dest = destinations.find((d) => d.name.toLowerCase() === input.destination.toLowerCase());
  const sights = dest?.experiences ?? ["City centre walk", "Local museum", "Evening market"];

  const itinerary: TripDay[] = Array.from({ length: days }, (_, i) => {
    const dayNo = i + 1;
    const first = dayNo === 1;
    const last = dayNo === days;
    const activitiesList: Activity[] = [];

    if (first) {
      activitiesList.push({
        time: "09:00 AM",
        title: `Arrival in ${input.destination}`,
        note: `${input.transport} from the station / airport`,
        cost: cab ? Math.round(cab.priceFrom * 12) : 0,
        priceConfirmed: Boolean(cab),
        distanceKm: 12,
        travelMins: 35,
        vendorId: cab?.id,
        category: "Transport",
      });
      activitiesList.push({
        time: "10:30 AM",
        title: `Check-in · ${hotel?.name ?? "Recommended stay"}`,
        note: hotel
          ? `${nights} nights at the vendor's confirmed starting price of ${formatINR(perNightHotel)} per night`
          : "No approved stay with a confirmed price is available yet",
        cost: stayTotal,
        priceConfirmed: Boolean(hotel),
        distanceKm: 1.2,
        travelMins: 6,
        vendorId: hotel?.id,
        category: "Stay",
      });
    } else {
      activitiesList.push({
        time: "08:30 AM",
        title: "Breakfast near your stay",
        note: input.food === "Street Food" ? "Street breakfast stall" : "Café near the hotel",
        cost: mealVendor ? mealVendor.priceFrom * input.travellers : 0,
        priceConfirmed: Boolean(mealVendor),
        distanceKm: 0.4,
        travelMins: 5,
        vendorId: restaurant?.id,
        category: "Food",
      });
    }

    activitiesList.push({
      time: "12:30 PM",
      title:
        input.food === "Cloud Kitchen / Delivery" ? "Lunch delivered to your stay" : "Local lunch",
      note: mealVendor
        ? `${mealVendor.name} · confirmed starting price ${formatINR(mealVendor.priceFrom)} per person`
        : "No approved food vendor with a confirmed price is available yet",
      cost: mealVendor ? mealVendor.priceFrom * input.travellers : 0,
      priceConfirmed: Boolean(mealVendor),
      distanceKm: 1.1,
      travelMins: 8,
      vendorId: restaurant?.id,
      category: "Food",
    });

    activitiesList.push({
      time: "02:00 PM",
      title: sights[(i * 2) % sights.length] ?? "City highlight",
      note: input.interests.includes("History")
        ? "Guided context available at the entrance"
        : "Entry ticket plus short local ride",
      cost: activityVendor ? activityVendor.priceFrom * input.travellers : 0,
      priceConfirmed: Boolean(activityVendor),
      distanceKm: 4.2,
      travelMins: 18,
      vendorId: activityVendor?.id,
      category: "Activity",
    });

    if (!last) {
      activitiesList.push({
        time: "05:00 PM",
        title: sights[(i * 2 + 1) % sights.length] ?? "Evening stop",
        note: input.interests.includes("Photography")
          ? "Best light for photos is just before sunset"
          : "Easy evening stop close to the previous sight",
        cost: activityVendor ? activityVendor.priceFrom * input.travellers : 0,
        priceConfirmed: Boolean(activityVendor),
        distanceKm: 2.6,
        travelMins: 12,
        vendorId: activityVendor?.id,
        category: "Activity",
      });
      activitiesList.push({
        time: "08:00 PM",
        title: input.food === "Street Food" ? "Street food dinner crawl" : "Local dinner",
        note: restaurant ? `Suggested: ${restaurant.name}` : "Vendor suggestions in your area",
        cost: mealVendor ? mealVendor.priceFrom * input.travellers : 0,
        priceConfirmed: Boolean(mealVendor),
        distanceKm: 1.8,
        travelMins: 10,
        vendorId: restaurant?.id,
        category: "Food",
      });
    } else {
      activitiesList.push({
        time: "05:00 PM",
        title: "Departure transfer",
        note: `${input.transport} to the station / airport`,
        cost: cab ? Math.round(cab.priceFrom * 12) : 0,
        priceConfirmed: Boolean(cab),
        distanceKm: 12,
        travelMins: 35,
        vendorId: cab?.id,
        category: "Transport",
      });
    }

    return {
      day: dayNo,
      title: first
        ? "Arrival + city exploration"
        : last
          ? "Last morning + departure"
          : `${input.interests[(i - 1) % Math.max(1, input.interests.length)] ?? "City"} day`,
      activities: activitiesList,
    };
  });

  const categoryTotal = (category: Activity["category"]) =>
    itinerary
      .flatMap((day) => day.activities)
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.cost, 0);
  const accommodation = categoryTotal("Stay");
  const food = categoryTotal("Food");
  const transport = categoryTotal("Transport");
  const activities = categoryTotal("Activity");
  const contingency = 0;
  const total = accommodation + food + transport + activities;
  const unavailable = [
    !hotel && "accommodation",
    !mealVendor && "food",
    !cab && "transport",
    !activityVendor && "activities",
  ].filter(Boolean);

  return {
    input,
    nights,
    days,
    budget: { accommodation, food, transport, activities, contingency },
    total,
    remaining: budget - total,
    perNightHotel,
    perPersonPerDayFood,
    itinerary,
    notes: [
      unavailable.length
        ? `Confirmed vendor prices cover ${formatINR(total)}. Price unavailable for: ${unavailable.join(", ")}. These are excluded from the total.`
        : `Every displayed amount comes from an approved vendor's confirmed starting price. Confirmed plan total: ${formatINR(total)}.`,
    ],
  };
}

function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export type PlanInstructionResult = { plan: TripPlan; reply: string };

/** Interprets plain-language edits from the YATRI AI chat and rebuilds the plan. */
export function applyInstruction(plan: TripPlan, instruction: string): PlanInstructionResult {
  const text = instruction.toLowerCase();
  const input = { ...plan.input, interests: [...plan.input.interests] };
  const messages: string[] = [];

  const capMatch = text.match(/(?:under|below|within|max(?:imum)?)\s*₹?\s*([\d,]+)/);
  if (capMatch) {
    const cap = Number((capMatch[1] ?? "0").replace(/,/g, ""));
    if (cap > 0) {
      input.budget = cap;
      if (input.accommodation === "Premium") input.accommodation = "Mid-range";
      else if (input.accommodation === "Mid-range" && cap < plan.input.budget * 0.85)
        input.accommodation = "Budget";
      messages.push(
        `The budget cap is now ${formatINR(cap)}; confirmed vendor prices remain unchanged.`,
      );
    }
  }

  if (/reduce|cheaper|less|lower/.test(text) && /hotel|stay|accommodation/.test(text)) {
    input.accommodation = input.accommodation === "Premium" ? "Mid-range" : "Budget";
    messages.push(
      "Changed the requested accommodation tier. Only matching confirmed vendor prices are counted.",
    );
  }
  if (/better hotel|upgrade|premium stay/.test(text)) {
    input.accommodation = input.accommodation === "Budget" ? "Mid-range" : "Premium";
    messages.push("Upgraded your stay tier.");
  }
  if (/(spend less|less|reduce|cheaper).*(food|eating)/.test(text)) {
    input.food = "Street Food";
    messages.push("Changed the food preference. Only approved vendor prices are counted.");
  }
  if (/more cultural|add culture|cultural activities/.test(text)) {
    if (!input.interests.includes("Culture")) input.interests.push("Culture");
    if (!input.interests.includes("History")) input.interests.push("History");
    messages.push("Added more cultural and heritage stops.");
  }
  if (/remove shopping|no shopping|less shopping/.test(text)) {
    input.interests = input.interests.filter((i) => i !== "Shopping");
    messages.push("Removed shopping from the itinerary.");
  }
  if (/add (one )?more day|extra day|one more day/.test(text)) {
    const end = new Date(input.endDate || Date.now());
    end.setDate(end.getDate() + 1);
    input.endDate = end.toISOString().slice(0, 10);
    messages.push("Added one more day to your trip.");
  }
  if (/public transport|cheaper transport|less on transport/.test(text)) {
    input.transport = "Public Transport";
    messages.push("Switched local travel to public transport.");
  }
  if (/mechanic/.test(text)) {
    messages.push(
      "Verified mechanics along your route are pinned on the trip map under the Mechanic filter.",
    );
  }
  if (/medical|hospital|pharmacy/.test(text)) {
    messages.push("Nearby verified medical services are pinned on your trip map.");
  }

  const next = generatePlan(input);
  const reply = messages.length
    ? `${messages.join(" ")} Confirmed-price total is ${formatINR(next.total)}, leaving ${formatINR(Math.max(0, next.remaining))} of your budget.`
    : `I kept your plan structure. Confirmed-price total is ${formatINR(next.total)}, with unavailable prices excluded. Try "add more cultural activities" or "use public transport".`;

  return { plan: next, reply };
}
