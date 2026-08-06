export type Destination = {
  id: string;
  name: string;
  country: string;
  image: string;
};

export type WayMaker = {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  walksCount: number;
  tags: string[];
  quote: string;
};

export type Journey = {
  id: string;
  city: string;
  country: string;
  dates: string;
  image: string;
  status: "ready" | "matching" | "past";
  curatedBy?: { name: string; avatar: string };
  tags: string[];
  matchProgress?: number;
};

export type TravelStyleOption = {
  id: string;
  label: string;
  description: string;
  icon: "relaxed" | "adventurous" | "family" | "culture";
};

export const CATEGORY_TAGS = ["Slow Travel", "Local Food", "Art & Culture", "Nature"];

export const DESTINATIONS: Destination[] = [
  {
    id: "rome",
    name: "Rome",
    country: "ITALY",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "florence",
    name: "Florence",
    country: "ITALY",
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=900&q=80",
  },
];

export const TRAVEL_STYLES: TravelStyleOption[] = [
  {
    id: "relaxed",
    label: "Relaxed & Slow",
    icon: "relaxed",
    description: "Unrushed mornings and lingering at local cafés.",
  },
  {
    id: "adventurous",
    label: "Adventurous & Active",
    icon: "adventurous",
    description: "Outdoor trails and getting off the beaten path.",
  },
  {
    id: "family",
    label: "Family-friendly",
    icon: "family",
    description: "Easy pacing and experiences that work for all ages.",
  },
  {
    id: "culture",
    label: "Culture & History",
    icon: "culture",
    description: "Heritage, architecture and museum collections.",
  },
];

export const SELECTED_STYLES = ["relaxed", "culture"];

export const FLORENCE_WAYMAKERS: WayMaker[] = [
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    title: "Expert in Renaissance Art & Hidden Trattorias",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    walksCount: 150,
    tags: ["Art History", "Local Food"],
    quote:
      "If I were you, I'd skip the Uffizi line and start with the secret Vasari Corridor, then a lampredotto sandwich only locals know.",
  },
  {
    id: "lorenzo-bianchi",
    name: "Lorenzo Bianchi",
    title: "Tuscan Vineyards & Local Craftsmanship",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    walksCount: 98,
    tags: ["Wine", "Artisans"],
    quote:
      "Spend less time in museums and more in Oltrarno, watching bookbinders at work over a glass of Chianti.",
  },
];

export const MY_JOURNEYS: Journey[] = [
  {
    id: "florence-2024",
    city: "Florence",
    country: "Italy",
    dates: "Sept 12 – Sept 18",
    image:
      "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=900&q=80",
    status: "ready",
    curatedBy: {
      name: "Marco",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
    tags: ["Art History", "Slow Food"],
  },
  {
    id: "highlands-flex",
    city: "Scottish Highlands",
    country: "United Kingdom",
    dates: "Dates flexible • Nature focus",
    image:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
    status: "matching",
    tags: ["Nature", "Hiking"],
    matchProgress: 65,
  },
  {
    id: "santorini-2023",
    city: "Santorini",
    country: "Greece",
    dates: "May 2023",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=300&q=80",
    status: "past",
    tags: ["Sunset Walk"],
  },
  {
    id: "kyoto-2022",
    city: "Kyoto",
    country: "Japan",
    dates: "Oct 2022",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80",
    status: "past",
    tags: ["Tea Ceremony"],
  },
];
