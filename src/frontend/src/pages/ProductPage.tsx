import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SAMPLE_PACKS, formatPrice } from "@/data/samplePacks";
import { useActor } from "@/hooks/useActor";
import { useGetStickerPack, useIsStripeConfigured } from "@/hooks/useQueries";
import { useParams } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Loader2, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ProductPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { actor } = useActor();
  const { data: backendPack, isLoading } = useGetStickerPack(id);
  const { data: stripeConfigured } = useIsStripeConfigured();
  const [isBuying, setIsBuying] = useState(false);

  const samplePack = SAMPLE_PACKS.find((p) => p.id === id);

  const pack = backendPack
    ? {
        id: backendPack.id,
        name: backendPack.name,
        description: backendPack.description,
        priceCents: Number(backendPack.priceCents),
        categoryTags: backendPack.categoryTags,
        image: backendPack.previewImageBlobId.getDirectURL(),
      }
    : (samplePack ?? null);

  const handleBuy = async () => {
    if (!actor || !pack) return;
    setIsBuying(true);
    try {
      const orderId = await actor.createOrder(pack.id);
      const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`;
      const cancelUrl = `${window.location.origin}/product/${pack.id}`;
      const stripeUrl = await actor.createCheckoutSession(
        [
          {
            productName: pack.name,
            currency: "usd",
            quantity: 1n,
            priceInCents: BigInt(pack.priceCents),
            productDescription: pack.description,
          },
        ],
        successUrl,
        cancelUrl,
      );
      window.location.href = stripeUrl;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setIsBuying(false);
    }
  };

  if (isLoading && !samplePack) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton
            data-ocid="product.loading_state"
            className="aspect-square rounded-3xl"
          />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-2xl" />
            <Skeleton className="h-4 w-1/4 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
        </div>
      </main>
    );
  }

  if (!pack) {
    return (
      <main className="container mx-auto px-4 py-12 text-center">
        <p className="text-5xl mb-4">😢</p>
        <h1 className="font-display font-bold text-2xl mb-2">Pack not found</h1>
        <Button asChild variant="outline" className="rounded-full mt-4">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-square rounded-3xl overflow-hidden border border-border shadow-soft"
        >
          <img
            src={pack.image}
            alt={pack.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pack.categoryTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="font-display font-black text-3xl md:text-4xl mb-3">
            {pack.name}
          </h1>

          <p className="font-display font-bold text-3xl text-primary mb-6">
            {formatPrice(pack.priceCents)}
          </p>

          <p className="text-muted-foreground leading-relaxed mb-8">
            {pack.description}
          </p>

          {/* Features */}
          <div className="bg-muted/50 rounded-2xl p-5 mb-8 space-y-2">
            <p className="font-semibold text-sm mb-3">What's included:</p>
            {[
              "⚡ Instant digital download",
              "🖼️ High-resolution PNG files",
              "📱 Compatible with GoodNotes, Notability, Canva & more",
              "🌍 Personal & commercial use license",
            ].map((f) => (
              <p key={f} className="text-sm text-muted-foreground">
                {f}
              </p>
            ))}
          </div>

          {/* Buy Button */}
          {stripeConfigured === false ? (
            <div className="bg-muted/50 rounded-2xl p-5 text-center">
              <p className="text-2xl mb-2">🚀</p>
              <p className="font-semibold">Coming Soon!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Payments are being set up. Check back shortly!
              </p>
            </div>
          ) : (
            <Button
              onClick={handleBuy}
              disabled={isBuying || !actor}
              data-ocid="product.primary_button"
              size="lg"
              className="rounded-full font-bold text-base w-full sm:w-auto px-10"
            >
              {isBuying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Buy Now – {formatPrice(pack.priceCents)}
                </>
              )}
            </Button>
          )}

          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            Download link delivered instantly after checkout
          </p>
        </motion.div>
      </div>
    </main>
  );
}
