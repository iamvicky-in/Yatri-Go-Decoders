import jaipurImg from "@/assets/dest-jaipur.jpg";
import goaImg from "@/assets/dest-goa.jpg";
import manaliImg from "@/assets/dest-manali.jpg";
import varanasiImg from "@/assets/dest-varanasi.jpg";
import udaipurImg from "@/assets/dest-udaipur.jpg";
import rishikeshImg from "@/assets/dest-rishikesh.jpg";
import keralaImg from "@/assets/dest-kerala.jpg";

/**
 * Prototype sample data.
 * Replace these modules with API calls when the backend is connected —
 * every consumer reads through the helpers at the bottom of this file.
 */

export type Destination = {
  slug: string;
  name: string;
  state: string;
  image: string;
  fromBudget: number;
  bestFor: string[];
  experiences: string[];
  blurb: string;
};

export const destinations: Destination[] = [
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    image: jaipurImg,
    fromBudget: 4999,
    bestFor: ["Culture", "Food", "History"],
    experiences: ["City Palace", "Hawa Mahal", "Amber Fort", "Bapu Bazaar"],
    blurb: "Forts, pink sandstone bazaars and Rajasthani thalis — the classic first trip.",
  },
  {
    slug: "goa",
    name: "Goa",
    state: "Goa",
    image: goaImg,
    fromBudget: 7499,
    bestFor: ["Beaches", "Nightlife", "Food"],
    experiences: ["Palolem Beach", "Fontainhas", "Saturday Night Market"],
    blurb: "Beach shacks, Portuguese lanes and the easiest coastline in India to travel solo.",
  },
  {
    slug: "manali",
    name: "Manali",
    state: "Himachal Pradesh",
    image: manaliImg,
    fromBudget: 6499,
    bestFor: ["Adventure", "Nature", "Photography"],
    experiences: ["Solang Valley", "Old Manali cafés", "Hampta trail"],
    blurb: "Pine valleys, snow passes and a long list of adventure operators.",
  },
  {
    slug: "rishikesh",
    name: "Rishikesh",
    state: "Uttarakhand",
    image: rishikeshImg,
    fromBudget: 4299,
    bestFor: ["Spiritual", "Adventure", "Nature"],
    experiences: ["Ganga Aarti", "River rafting", "Beatles Ashram"],
    blurb: "Morning aarti, afternoon rafting — cheap to travel, easy to reach.",
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    image: varanasiImg,
    fromBudget: 3999,
    bestFor: ["Spiritual", "Culture", "Food"],
    experiences: ["Dashashwamedh Ghat", "Sarnath", "Banarasi silk weavers"],
    blurb: "Ghats at sunrise, kachori-sabzi breakfasts and centuries-old craft lanes.",
  },
  {
    slug: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    image: udaipurImg,
    fromBudget: 5499,
    bestFor: ["Culture", "Family", "Photography"],
    experiences: ["Lake Pichola", "City Palace", "Shilpgram craft village"],
    blurb: "Lakes, havelis and slow evenings — the softest landing in Rajasthan.",
  },
  {
    slug: "kerala",
    name: "Kerala",
    state: "Kerala",
    image: keralaImg,
    fromBudget: 8999,
    bestFor: ["Nature", "Family", "Food"],
    experiences: ["Alleppey backwaters", "Fort Kochi", "Munnar tea estates"],
    blurb: "Backwater houseboats, spice hills and some of India's best home-cooked food.",
  },
  {
    slug: "shimla",
    name: "Shimla",
    state: "Himachal Pradesh",
    image: manaliImg,
    fromBudget: 5499,
    bestFor: ["Family", "Nature", "Photography"],
    experiences: ["The Ridge & Mall Road", "Jakhoo Temple", "Kufri", "Toy train to Kalka"],
    blurb: "Colonial ridgelines, deodar walks and the easiest hill station to reach from Delhi.",
  },
  {
    slug: "dharamshala",
    name: "Dharamshala",
    state: "Himachal Pradesh",
    image: manaliImg,
    fromBudget: 5299,
    bestFor: ["Spiritual", "Nature", "Adventure"],
    experiences: ["McLeod Ganj", "Bhagsu waterfall", "Triund trek", "Dalai Lama Temple"],
    blurb: "Tibetan monasteries, café lanes and a first trek that most people can finish.",
  },
  {
    slug: "kasol",
    name: "Kasol",
    state: "Himachal Pradesh",
    image: manaliImg,
    fromBudget: 4599,
    bestFor: ["Nature", "Adventure", "Food"],
    experiences: ["Parvati riverside", "Chalal walk", "Tosh village", "Kheerganga trail"],
    blurb: "Riverside camps in the Parvati valley — cheap stays and long walking days.",
  },
  {
    slug: "nainital",
    name: "Nainital",
    state: "Uttarakhand",
    image: rishikeshImg,
    fromBudget: 4899,
    bestFor: ["Family", "Nature", "Photography"],
    experiences: ["Naini Lake boating", "Snow View Point", "Tiffin Top", "Mall Road evening"],
    blurb: "A lake in the middle of town, short ropeway rides and very easy family days.",
  },
  {
    slug: "mussoorie",
    name: "Mussoorie",
    state: "Uttarakhand",
    image: rishikeshImg,
    fromBudget: 4699,
    bestFor: ["Family", "Nature", "Culture"],
    experiences: ["Kempty Falls", "Gun Hill", "Camel's Back Road", "Landour bakery lanes"],
    blurb: "Queen of the hills — cloud-level viewpoints and quiet Landour mornings.",
  },
  {
    slug: "haridwar",
    name: "Haridwar",
    state: "Uttarakhand",
    image: rishikeshImg,
    fromBudget: 3499,
    bestFor: ["Spiritual", "Culture", "Family"],
    experiences: ["Har Ki Pauri aarti", "Mansa Devi ropeway", "Chandi Devi", "Local bazaars"],
    blurb: "Evening aarti on the Ganga and the cheapest base for an Uttarakhand trip.",
  },
  {
    slug: "auli",
    name: "Auli",
    state: "Uttarakhand",
    image: manaliImg,
    fromBudget: 6999,
    bestFor: ["Adventure", "Nature", "Photography"],
    experiences: ["Auli ropeway", "Ski slopes", "Gurson Bugyal", "Nanda Devi viewpoints"],
    blurb: "Snow slopes and one of the longest ropeways in Asia, straight above Joshimath.",
  },
];

export type VendorCategory =
  | "Hotel"
  | "Restaurant"
  | "Cloud Kitchen"
  | "Medical"
  | "Mechanic"
  | "Transport"
  | "Activity"
  | "Emergency";

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  city: string;
  area: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  priceRange: string;
  priceFrom: number;
  verified: boolean;
  openNow: boolean;
  hours: string;
  phone: string;
  image: string;
  description: string;
  /** Normalised 0-100 position used by the compact prototype map canvas. */
  x: number;
  y: number;
  /** Real-world coordinates used by the OpenStreetMap map. */
  lat: number;
  lng: number;
};

/**
 * Short-hand rows for the Himachal Pradesh and Uttarakhand businesses.
 * [id, name, category, city, area, price from, price text, hours, phone, lat, lng, description]
 */
type HillRow = [
  string,
  string,
  VendorCategory,
  string,
  string,
  number,
  string,
  string,
  string,
  number,
  number,
  string,
];

const hillRows: HillRow[] = [
  // Himachal Pradesh — Manali
  ["v-manali-stay","Solang Valley Stay","Hotel","Manali","Old Manali",1500,"₹1,500 – ₹3,200 / night","Reception 24×7","+91 94180 22110",32.2432,77.1892,"Pine-facing rooms with mountain-view balconies and free parking."],
  ["v-manali-food","Himalayan Thali House","Restaurant","Manali","Mall Road",220,"₹220 – ₹500 / person","8:00 AM – 11:00 PM","+91 94180 33471",32.2418,77.1887,"Himachali siddu, trout and North Indian thalis on Mall Road."],
  // Uttarakhand — Rishikesh
  ["v-rishi-stay","Ganga Riverside Stay","Hotel","Rishikesh","Tapovan",1250,"₹1,250 – ₹2,700 / night","Reception 24×7","+91 94120 90114",30.1276,78.3234,"River-facing rooms near Laxman Jhula with yoga deck and breakfast."],
  ["v-rishi-food","Tapovan Ganga Cafe","Restaurant","Rishikesh","Laxman Jhula",180,"₹180 – ₹400 / person","7:00 AM – 10:30 PM","+91 94120 90228",30.1290,78.3200,"Vegetarian bowls, thalis and river-view breakfasts."],
  ["v-rishi-cab","Devbhoomi Cabs","Transport","Rishikesh","Nepali Farm",11,"₹11 / km","Open 24 hours","+91 94120 90335",30.0869,78.2676,"Dehradun airport, Haridwar station and rafting point transfers."],
  ["v-rishi-act","Shivpuri Rafting Co.","Activity","Rishikesh","Shivpuri",700,"₹700 / person","6:30 AM – 5:00 PM","+91 94120 90442",30.1180,78.4050,"16 km Ganga rafting with certified guides, gear and photos."],
  ["v-manali-cab","Beas Valley Cabs","Transport","Manali","Bus Stand",13,"₹13 / km","Open 24 hours","+91 94180 55219",32.2396,77.1887,"Sightseeing cabs for Solang, Rohtang permits and Kullu airport transfers."],
  ["v-manali-act","Solang Adventure Co.","Activity","Manali","Solang",800,"₹800 / person","8:00 AM – 6:00 PM","+91 94180 77002",32.3169,77.1566,"Paragliding, zorbing and snow activities with certified instructors."],
  // Himachal Pradesh — Shimla
  ["v-shimla-stay","Ridge View Lodge","Hotel","Shimla","The Ridge",1400,"₹1,400 – ₹2,900 / night","Reception 24×7","+91 94590 11002",31.1048,77.1734,"Heritage lodge two minutes from Mall Road with heated rooms."],
  ["v-shimla-food","Mall Road Kitchen","Restaurant","Shimla","Mall Road",200,"₹200 – ₹450 / person","8:00 AM – 10:30 PM","+91 94590 44118",31.1033,77.1722,"Himachali dham, siddu and North Indian meals right on Mall Road."],
  ["v-shimla-cab","Kalka Hill Cabs","Transport","Shimla","Old Bus Stand",12,"₹12 / km","Open 24 hours","+91 94590 66231",31.1017,77.1696,"Airport, Kalka railway and Kufri day-trip cabs at fixed fares."],
  ["v-shimla-act","Kufri Trails","Activity","Shimla","Kufri",550,"₹550 / person","7:00 AM – 5:00 PM","+91 94590 88760",31.0975,77.2673,"Guided deodar forest walks, Kufri viewpoints and horse rides."],
  // Himachal Pradesh — Dharamshala
  ["v-dharam-stay","McLeod Ganj Retreat","Hotel","Dharamshala","McLeod Ganj",1300,"₹1,300 – ₹2,600 / night","Reception 24×7","+91 94185 20114",32.2396,76.3204,"Valley-view rooms a short walk from the Dalai Lama Temple."],
  ["v-dharam-food","Bhagsu Tibetan Kitchen","Restaurant","Dharamshala","Bhagsu",180,"₹180 – ₹420 / person","7:30 AM – 10:30 PM","+91 94185 33907",32.2432,76.3287,"Thukpa, momos and Himachali plates near Bhagsu waterfall."],
  ["v-dharam-cab","Kangra Valley Taxis","Transport","Dharamshala","Kotwali Bazaar",12,"₹12 / km","Open 24 hours","+91 94185 55012",32.2190,76.3234,"Gaggal airport, Pathankot station and Triund base drops."],
  ["v-dharam-act","Triund Trek Guides","Activity","Dharamshala","Dharamkot",900,"₹900 / person","5:00 AM – 6:00 PM","+91 94185 77440",32.2504,76.3300,"Day and overnight Triund treks with permits, guide and tea stops."],
  // Uttarakhand — Nainital
  ["v-naini-stay","Naini Lakeside Inn","Hotel","Nainital","Mallital",1450,"₹1,450 – ₹3,000 / night","Reception 24×7","+91 94120 11205",29.3919,79.4542,"Lake-facing rooms with breakfast and pick-up from Kathgodam."],
  ["v-naini-food","Pahadi Rasoi","Restaurant","Nainital","Mall Road",190,"₹190 – ₹430 / person","8:00 AM – 10:30 PM","+91 94120 44831",29.3888,79.4614,"Kumaoni thali, bhatt ki churkani and vegetarian North Indian food."],
  ["v-naini-cab","Kumaon Hill Cabs","Transport","Nainital","Tallital",12,"₹12 / km","Open 24 hours","+91 94120 66190",29.3803,79.4636,"Kathgodam transfers and Bhimtal–Sattal–Naukuchiatal day circuits."],
  ["v-naini-act","Naini Boating & Trails","Activity","Nainital","Naini Lake",400,"₹400 / person","6:30 AM – 7:00 PM","+91 94120 88377",29.3913,79.4585,"Lake boating, Tiffin Top walks and Snow View ropeway bookings."],
  // Uttarakhand — Mussoorie
  ["v-muss-stay","Landour Pine Stay","Hotel","Mussoorie","Landour",1600,"₹1,600 – ₹3,400 / night","Reception 24×7","+91 94110 22507",30.4553,78.0913,"Quiet Landour rooms with valley views and a wood-fire lounge."],
  ["v-muss-food","Camel's Back Café","Restaurant","Mussoorie","Camel's Back Road",210,"₹210 – ₹480 / person","8:00 AM – 10:00 PM","+91 94110 33682",30.4599,78.0676,"Bakery breakfasts, Garhwali plates and hot soups on the ridge."],
  ["v-muss-cab","Doon Valley Cabs","Transport","Mussoorie","Library Chowk",12,"₹12 / km","Open 24 hours","+91 94110 55246",30.4571,78.0709,"Dehradun airport and railway transfers, Kempty Falls day trips."],
  ["v-muss-act","Kempty Adventure Walks","Activity","Mussoorie","Kempty",450,"₹450 / person","7:00 AM – 6:00 PM","+91 94110 77913",30.4818,78.0104,"Waterfall trails, Gun Hill sunset walks and Landour heritage tours."],
  // Uttarakhand — Haridwar
  ["v-hari-stay","Ganga Ghat Stay","Hotel","Haridwar","Har Ki Pauri",1100,"₹1,100 – ₹2,200 / night","Reception 24×7","+91 94570 11884",29.9457,78.1642,"Simple river-side rooms a few steps from the evening aarti."],
  ["v-hari-food","Sattvik Bhojanalaya","Restaurant","Haridwar","Upper Road",150,"₹150 – ₹350 / person","7:00 AM – 10:00 PM","+91 94570 44226",29.9450,78.1620,"Pure vegetarian thalis, kachori breakfasts and fresh lassi."],
  ["v-hari-cab","Char Dham Transfers","Transport","Haridwar","Railway Road",11,"₹11 / km","Open 24 hours","+91 94570 66518",29.9430,78.1603,"Rishikesh, Dehradun and Char Dham route cabs with fixed fares."],
  ["v-hari-act","Aarti Heritage Walks","Activity","Haridwar","Har Ki Pauri",300,"₹300 / person","5:00 AM – 9:00 PM","+91 94570 88031",29.9465,78.1650,"Ghat walks, aarti seating and Mansa Devi ropeway assistance."],
];

const hillVendors: Vendor[] = hillRows.map((r, i) => ({
  id: r[0],
  name: r[1],
  category: r[2],
  city: r[3],
  area: r[4],
  rating: 4.3 + ((i % 5) * 0.1),
  reviews: 120 + i * 17,
  distanceKm: 1 + (i % 4),
  priceRange: r[6],
  priceFrom: r[5],
  verified: true,
  openNow: true,
  hours: r[7],
  phone: r[8],
  image: r[3] === "Nainital" || r[3] === "Mussoorie" || r[3] === "Haridwar" ? rishikeshImg : manaliImg,
  description: r[11],
  x: 20 + ((i * 7) % 60),
  y: 20 + ((i * 11) % 60),
  lat: r[9],
  lng: r[10],
}));

export const vendors: Vendor[] = [
  {
    id: "v-rajputana",
    name: "Rajputana Heritage Stay",
    category: "Hotel",
    city: "Jaipur",
    area: "Bani Park",
    rating: 4.7,
    reviews: 412,
    distanceKm: 2.1,
    priceRange: "₹1,200 – ₹2,400 / night",
    priceFrom: 1200,
    verified: true,
    openNow: true,
    hours: "Reception 24×7",
    phone: "+91 98290 11221",
    image: jaipurImg,
    description:
      "Restored haveli with 18 rooms, courtyard breakfast and free pickup from Jaipur Junction.",
    x: 32,
    y: 38,
    lat: 26.9319,
    lng: 75.7965,
  },
  {
    id: "v-pinkcity",
    name: "Pink City Kitchen",
    category: "Restaurant",
    city: "Jaipur",
    area: "MI Road",
    rating: 4.5,
    reviews: 1268,
    distanceKm: 1.4,
    priceRange: "₹200 – ₹450 / person",
    priceFrom: 200,
    verified: true,
    openNow: true,
    hours: "8:00 AM – 11:30 PM",
    phone: "+91 98290 44510",
    image: varanasiImg,
    description: "Rajasthani thalis, dal baati churma and a dependable vegetarian menu.",
    x: 48,
    y: 52,
    lat: 26.9157,
    lng: 75.804,
  },
  {
    id: "v-autocare",
    name: "Jaipur Auto Care",
    category: "Mechanic",
    city: "Jaipur",
    area: "Tonk Road",
    rating: 4.6,
    reviews: 286,
    distanceKm: 2.4,
    priceRange: "₹300 – ₹2,500 / job",
    priceFrom: 300,
    verified: true,
    openNow: true,
    hours: "7:00 AM – 10:00 PM",
    phone: "+91 98290 77310",
    image: manaliImg,
    description: "Two-wheeler and car repairs, roadside assistance within 8 km of the city centre.",
    x: 66,
    y: 30,
    lat: 26.86,
    lng: 75.8,
  },
  {
    id: "v-citycare",
    name: "CityCare Medical",
    category: "Medical",
    city: "Jaipur",
    area: "C-Scheme",
    rating: 4.8,
    reviews: 903,
    distanceKm: 1.1,
    priceRange: "₹150 consultation",
    priceFrom: 150,
    verified: true,
    openNow: true,
    hours: "Open 24 hours",
    phone: "+91 141 400 2020",
    image: udaipurImg,
    description: "Multi-speciality clinic with 24×7 pharmacy and in-house diagnostics.",
    x: 22,
    y: 64,
    lat: 26.9089,
    lng: 75.796,
  },
  {
    id: "v-marudhar",
    name: "Marudhar Cabs",
    category: "Transport",
    city: "Jaipur",
    area: "Sindhi Camp",
    rating: 4.4,
    reviews: 654,
    distanceKm: 3.2,
    priceRange: "₹11 / km",
    priceFrom: 11,
    verified: true,
    openNow: true,
    hours: "Open 24 hours",
    phone: "+91 98290 66004",
    image: rishikeshImg,
    description: "Local sightseeing cabs and airport transfers with fixed-fare day packages.",
    x: 58,
    y: 70,
    lat: 26.924,
    lng: 75.797,
  },
  {
    id: "v-chowkitchen",
    name: "Chokhi Cloud Kitchen",
    category: "Cloud Kitchen",
    city: "Jaipur",
    area: "Vaishali Nagar",
    rating: 4.3,
    reviews: 341,
    distanceKm: 4.6,
    priceRange: "₹150 – ₹350 / meal",
    priceFrom: 150,
    verified: false,
    openNow: true,
    hours: "10:00 AM – 12:00 AM",
    phone: "+91 98290 31187",
    image: goaImg,
    description: "Delivery-only kitchen serving Rajasthani and North Indian meal boxes.",
    x: 78,
    y: 56,
    lat: 26.911,
    lng: 75.737,
  },
  {
    id: "v-heritagewalks",
    name: "Heritage Walks Jaipur",
    category: "Activity",
    city: "Jaipur",
    area: "Chandpole",
    rating: 4.9,
    reviews: 188,
    distanceKm: 1.8,
    priceRange: "₹400 / person",
    priceFrom: 400,
    verified: true,
    openNow: false,
    hours: "6:30 AM – 9:00 AM",
    phone: "+91 98290 55908",
    image: jaipurImg,
    description: "Sunrise walking tours through the old city with a local historian guide.",
    x: 40,
    y: 20,
    lat: 26.928,
    lng: 75.81,
  },
  {
    id: "v-highway",
    name: "Highway Response Desk",
    category: "Emergency",
    city: "Jaipur",
    area: "Ajmer Road",
    rating: 4.5,
    reviews: 97,
    distanceKm: 5.3,
    priceRange: "Assistance on call",
    priceFrom: 0,
    verified: true,
    openNow: true,
    hours: "Open 24 hours",
    phone: "+91 141 400 9111",
    image: keralaImg,
    description: "Coordination desk that connects travellers to towing, ambulance and police help.",
    x: 12,
    y: 28,
    lat: 26.899,
    lng: 75.75,
  },
  {
    id: "v-lakeview",
    name: "Lakeview Residency",
    category: "Hotel",
    city: "Udaipur",
    area: "Lake Pichola",
    rating: 4.6,
    reviews: 522,
    distanceKm: 0.9,
    priceRange: "₹1,900 – ₹3,600 / night",
    priceFrom: 1900,
    verified: true,
    openNow: true,
    hours: "Reception 24×7",
    phone: "+91 94140 22119",
    image: udaipurImg,
    description: "Rooftop restaurant with lake views and airport transfers on request.",
    x: 54,
    y: 42,
    lat: 24.5726,
    lng: 73.68,
  },
  {
    id: "v-coastalshack",
    name: "Coastal Shack Kitchen",
    category: "Restaurant",
    city: "Goa",
    area: "Palolem",
    rating: 4.4,
    reviews: 736,
    distanceKm: 0.4,
    priceRange: "₹300 – ₹700 / person",
    priceFrom: 300,
    verified: true,
    openNow: true,
    hours: "9:00 AM – 11:00 PM",
    phone: "+91 98221 77341",
    image: goaImg,
    description: "Beachfront Goan seafood, thali lunches and vegetarian options.",
    x: 36,
    y: 74,
    lat: 15.01,
    lng: 74.0233,
  },
  ...hillVendors,
];

export const vendorCategories: { key: VendorCategory | "All"; label: string; icon: string }[] = [
  { key: "All", label: "All", icon: "✦" },
  { key: "Hotel", label: "Hotels", icon: "🏨" },
  { key: "Restaurant", label: "Food", icon: "🍽" },
  { key: "Cloud Kitchen", label: "Cloud Kitchens", icon: "☁" },
  { key: "Transport", label: "Transport", icon: "🚕" },
  { key: "Medical", label: "Medical", icon: "💊" },
  { key: "Mechanic", label: "Mechanic", icon: "🔧" },
  { key: "Activity", label: "Activities", icon: "🧳" },
  { key: "Emergency", label: "Emergency", icon: "🚨" },
];

export type CultureExperience = {
  id: string;
  title: string;
  theme: string;
  city: string;
  price: number;
  duration: string;
  summary: string;
  image: string;
};

export const cultureExperiences: CultureExperience[] = [
  {
    id: "c-thali",
    title: "Rajasthani home thali with a local family",
    theme: "Food",
    city: "Jaipur",
    price: 450,
    duration: "2 hours",
    summary: "Eat a seven-item thali cooked at home, with a short kitchen walkthrough.",
    image: jaipurImg,
  },
  {
    id: "c-folk",
    title: "Kalbelia folk performance evening",
    theme: "Traditional Experiences",
    city: "Jaipur",
    price: 600,
    duration: "90 minutes",
    summary: "Live folk dance and music by a performing family from Pushkar.",
    image: udaipurImg,
  },
  {
    id: "c-bazaar",
    title: "Bapu Bazaar market walk",
    theme: "Local Markets",
    city: "Jaipur",
    price: 300,
    duration: "3 hours",
    summary: "Bargaining, block prints and juttis with someone who shops there weekly.",
    image: varanasiImg,
  },
  {
    id: "c-blockprint",
    title: "Block printing with Sanganer artisans",
    theme: "Local Art",
    city: "Jaipur",
    price: 750,
    duration: "Half day",
    summary: "Carve, dye and print your own scarf at a family-run workshop.",
    image: goaImg,
  },
  {
    id: "c-aarti",
    title: "Ganga Aarti with a temple volunteer",
    theme: "Festivals",
    city: "Varanasi",
    price: 250,
    duration: "2 hours",
    summary: "Evening aarti seen from the boat side, with the ritual explained as it happens.",
    image: rishikeshImg,
  },
  {
    id: "c-fort",
    title: "Amber Fort history deep-dive",
    theme: "History",
    city: "Jaipur",
    price: 500,
    duration: "3 hours",
    summary: "A historian-led route through the fort's lesser-known courtyards.",
    image: manaliImg,
  },
];

export type Booking = {
  id: string;
  service: string;
  vendorId: string;
  date: string;
  time: string;
  guests: number;
  amount: number;
  status: "Confirmed" | "Pending" | "Completed";
};

export const sampleBookings: Booking[] = [
  {
    id: "YG-48210",
    service: "Rajputana Heritage Stay · Deluxe room",
    vendorId: "v-rajputana",
    date: "15 Oct 2026",
    time: "2:00 PM check-in",
    guests: 4,
    amount: 4800,
    status: "Confirmed",
  },
  {
    id: "YG-48377",
    service: "Heritage Walks Jaipur · Sunrise walk",
    vendorId: "v-heritagewalks",
    date: "16 Oct 2026",
    time: "6:30 AM",
    guests: 4,
    amount: 1600,
    status: "Pending",
  },
  {
    id: "YG-47120",
    service: "Marudhar Cabs · Full-day sightseeing",
    vendorId: "v-marudhar",
    date: "02 Sep 2026",
    time: "9:00 AM",
    guests: 4,
    amount: 1600,
    status: "Completed",
  },
];

export type SavedTrip = {
  id: string;
  destination: string;
  dates: string;
  travellers: number;
  budget: number;
  spent: number;
  status: "Upcoming" | "Active" | "Completed";
};

export const sampleTrips: SavedTrip[] = [
  {
    id: "t-jaipur-oct",
    destination: "Jaipur",
    dates: "15 Oct – 18 Oct 2026",
    travellers: 4,
    budget: 10000,
    spent: 6400,
    status: "Upcoming",
  },
  {
    id: "t-rishikesh-nov",
    destination: "Rishikesh",
    dates: "08 Nov – 10 Nov 2026",
    travellers: 2,
    budget: 8000,
    spent: 0,
    status: "Upcoming",
  },
  {
    id: "t-goa-jun",
    destination: "Goa",
    dates: "12 Jun – 16 Jun 2026",
    travellers: 2,
    budget: 18000,
    spent: 17450,
    status: "Completed",
  },
];

export const reviews = [
  {
    id: "r1",
    author: "Ananya R.",
    rating: 5,
    vendor: "Rajputana Heritage Stay",
    text: "Clean rooms, honest pricing and the owner arranged our cab at the rate YATRI GO showed.",
    date: "12 Aug 2026",
  },
  {
    id: "r2",
    author: "Imran S.",
    rating: 4,
    vendor: "Pink City Kitchen",
    text: "Thali was excellent value for four people. Slightly crowded at 9 PM.",
    date: "04 Aug 2026",
  },
  {
    id: "r3",
    author: "Meera K.",
    rating: 5,
    vendor: "Jaipur Auto Care",
    text: "Fixed a flat on a Sunday within 40 minutes of calling. Fair bill.",
    date: "28 Jul 2026",
  },
];

export function formatINR(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}

export function getVendor(id: string) {
  return vendors.find((v) => v.id === id);
}
