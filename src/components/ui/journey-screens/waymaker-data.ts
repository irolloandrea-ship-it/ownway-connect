/** Static preview data for the WayMaker in-phone journey (visual only). */

export const WM_CITIES = [
  {
    id: "florence",
    name: "Florence",
    country: "ITALY",
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "rome",
    name: "Rome",
    country: "ITALY",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "venice",
    name: "Venice",
    country: "ITALY",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=300&q=80",
  },
];

export const WM_EXPERTISE = [
  "Local Food",
  "Art & Culture",
  "Nightlife",
  "Slow Walks",
  "History",
  "Hidden Corners",
  "Live Music",
  "Photography",
];

export const WM_SELECTED_EXPERTISE = ["Local Food", "Art & Culture", "Slow Walks", "Hidden Corners"];

export const WM_GUIDANCE = [
  { id: "tips", title: "Practical Tips", desc: "Navigating local transit, timing and secrets." },
  { id: "stories", title: "Personal Stories", desc: "Anecdotes and history from a resident." },
  { id: "itineraries", title: "Thoughtful Itineraries", desc: "A daily flow tailored to their pace." },
];

export const WM_SELECTED_GUIDANCE = ["Practical Tips", "Personal Stories"];

export const WM_PROFILE = {
  name: "Isabella R.",
  city: "Florence",
  country: "Italy",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  expertise: WM_SELECTED_EXPERTISE,
};

export const WM_REQUEST = {
  travelerName: "Lucas & Sofia",
  travelerAvatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  arrivalWindow: "Arriving in 2 weeks",
  travelersCount: "Couple",
  dates: "Nov 2 – 6",
  city: "Florence",
  country: "Italy",
  tags: ["Art & Culture", "Wine & Dine"],
  message:
    "We love Renaissance art, but we'd rather discover independent bookshops, quiet cloisters and wine windows.",
  hero:
    "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=900&q=80",
  suggestions: [
    "The morning market in Sant'Ambrogio",
    "A sunset sketch by the Arno",
    "Coffee at Piazza della Passera",
  ],
};
