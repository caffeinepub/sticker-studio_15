export interface SamplePack {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  categoryTags: string[];
  image: string;
}

export const SAMPLE_PACKS: SamplePack[] = [
  {
    id: "cozy-cafe",
    name: "Cozy Cafe",
    description:
      "Adorable cafe-themed stickers perfect for food lovers and bullet journal enthusiasts. Includes 12 hand-drawn kawaii designs.",
    priceCents: 399,
    categoryTags: ["food", "kawaii"],
    image: "/assets/generated/pack-cozy-cafe.dim_600x600.jpg",
  },
  {
    id: "study-buddy",
    name: "Study Buddy",
    description:
      "Stay motivated with these cute study-themed stickers! Perfect for planners, notebooks, and digital journals.",
    priceCents: 399,
    categoryTags: ["study", "planner"],
    image: "/assets/generated/pack-study-buddy.dim_600x600.jpg",
  },
  {
    id: "garden-friends",
    name: "Garden Friends",
    description:
      "Bring the outdoors in with these charming garden creature stickers. Flowers, bugs, and nature in kawaii style.",
    priceCents: 499,
    categoryTags: ["nature", "kawaii"],
    image: "/assets/generated/pack-garden-friends.dim_600x600.jpg",
  },
  {
    id: "starry-night",
    name: "Starry Night",
    description:
      "Dreamy space-themed stickers for the stargazers and dreamers. Planets, moons, and cosmic vibes.",
    priceCents: 499,
    categoryTags: ["space", "aesthetic"],
    image: "/assets/generated/pack-starry-night.dim_600x600.jpg",
  },
  {
    id: "planner-essentials",
    name: "Planner Essentials",
    description:
      "The ultimate planner sticker pack. Checkboxes, dividers, headers and all the productivity tools you need.",
    priceCents: 599,
    categoryTags: ["planner", "productivity"],
    image: "/assets/generated/pack-planner-essentials.dim_600x600.jpg",
  },
  {
    id: "animal-buddies",
    name: "Animal Buddies",
    description:
      "Meet your new adorable sticker friends! 12 super cute chibi animals to brighten up any digital planner or device.",
    priceCents: 399,
    categoryTags: ["animals", "kawaii"],
    image: "/assets/generated/pack-animal-buddies.dim_600x600.jpg",
  },
];

export function formatPrice(cents: number | bigint): string {
  const c = typeof cents === "bigint" ? Number(cents) : cents;
  return `$${(c / 100).toFixed(2)}`;
}
