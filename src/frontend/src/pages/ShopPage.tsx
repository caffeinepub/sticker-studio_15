import { StickerPackCard } from "@/components/StickerPackCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SAMPLE_PACKS } from "@/data/samplePacks";
import { useListStickerPacks } from "@/hooks/useQueries";
import { motion } from "motion/react";
import { useState } from "react";

const CATEGORIES = [
  "all",
  "animals",
  "food",
  "study",
  "space",
  "planner",
  "kawaii",
];

export function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: backendPacks } = useListStickerPacks();

  const allPacks =
    backendPacks && backendPacks.length > 0
      ? backendPacks.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          priceCents: p.priceCents,
          categoryTags: p.categoryTags,
          image: p.previewImageBlobId.getDirectURL(),
        }))
      : SAMPLE_PACKS;

  const filtered =
    activeCategory === "all"
      ? allPacks
      : allPacks.filter((p) =>
          p.categoryTags.some((t) => t.toLowerCase() === activeCategory),
        );

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="font-display font-black text-4xl md:text-5xl mb-3">
          All Sticker Packs ✨
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover 💕 kawaii packs for every vibe
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div className="mb-8 flex justify-center">
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          data-ocid="shop.tab"
        >
          <TabsList className="flex flex-wrap gap-1 h-auto bg-muted/50 p-1 rounded-full">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="rounded-full capitalize text-sm px-4 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {cat === "all" ? "All Packs" : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          data-ocid="shop.empty_state"
          className="text-center py-20 text-muted-foreground"
        >
          <p className="text-5xl mb-4">🌸</p>
          <p className="font-display font-semibold text-xl">
            No packs in this category yet
          </p>
          <p className="text-sm mt-2">Check back soon for new arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pack, i) => (
            <StickerPackCard
              key={pack.id}
              id={pack.id}
              name={pack.name}
              description={pack.description}
              priceCents={pack.priceCents}
              categoryTags={pack.categoryTags}
              image={pack.image}
              index={i}
            />
          ))}
        </div>
      )}
    </main>
  );
}
