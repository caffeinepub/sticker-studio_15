import { StickerPackCard } from "@/components/StickerPackCard";
import { Button } from "@/components/ui/button";
import { SAMPLE_PACKS } from "@/data/samplePacks";
import { useListStickerPacks } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Download, Globe, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function HomePage() {
  const { data: backendPacks } = useListStickerPacks();

  const packs =
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

  const featured = packs.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="rounded-3xl overflow-hidden relative">
            <img
              src="/assets/generated/hero-banner.dim_1200x500.jpg"
              alt="StickerDrop – Cute digital sticker packs"
              className="w-full object-cover h-64 md:h-96 lg:h-[500px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent flex items-center">
              <div className="px-8 md:px-16 max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-white/90 text-sm font-medium mb-2 tracking-wider uppercase">
                    ✨ Digital Sticker Packs
                  </p>
                  <h1 className="font-display font-black text-3xl md:text-5xl text-white leading-tight mb-4">
                    Make Everything
                    <br />
                    <span className="text-pink-200">Adorably Yours 💕</span>
                  </h1>
                  <p className="text-white/85 text-base md:text-lg mb-6 leading-relaxed">
                    Kawaii stickers for planners, laptops & digital journals.
                    Instant download worldwide!
                  </p>
                  <Button
                    asChild
                    size="lg"
                    data-ocid="hero.primary_button"
                    className="bg-white text-foreground hover:bg-pink-50 rounded-full font-bold shadow-lg"
                  >
                    <Link to="/shop">Browse All Packs ✨</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Download className="w-6 h-6" />,
              title: "Instant Download",
              desc: "Get your stickers immediately after purchase",
              color: "bg-pink-50",
            },
            {
              icon: <Globe className="w-6 h-6" />,
              title: "Worldwide Access",
              desc: "Available in every country, any device",
              color: "bg-purple-50",
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Secure Payment",
              desc: "Stripe-powered safe checkout",
              color: "bg-green-50",
            },
          ].map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className={`${badge.color} rounded-2xl p-5 flex items-center gap-4`}
            >
              <div className="text-primary">{badge.icon}</div>
              <div>
                <p className="font-semibold text-sm">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Packs */}
      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-black text-3xl">
              Featured Packs ✨
            </h2>
            <p className="text-muted-foreground mt-1">
              Our most-loved collections
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/shop">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((pack, i) => (
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
      </section>

      {/* CTA banner */}
      <section className="pastel-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-4xl mb-4">🌸💕✨</p>
            <h2 className="font-display font-black text-3xl md:text-4xl mb-4">
              Ready to Cute-ify Your Life?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of planners and students who use StickerDrop
              stickers every day.
            </p>
            <Button asChild size="lg" className="rounded-full font-bold px-8">
              <Link to="/shop">Shop Sticker Packs 🛍️</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
