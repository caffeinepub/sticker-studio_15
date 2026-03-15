import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useActor } from "@/hooks/useActor";
import { useStripeSessionStatus } from "@/hooks/useQueries";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Download, Home, Loader2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function SuccessPage() {
  const search = useSearch({ strict: false }) as {
    session_id?: string;
    order_id?: string;
  };
  const sessionId = search.session_id ?? null;
  const orderId = search.order_id ?? null;

  const { actor } = useActor();
  const { data: sessionStatus } = useStripeSessionStatus(sessionId);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processOrder() {
      if (!actor || !orderId || !sessionId || !sessionStatus) return;
      if (sessionStatus.__kind__ !== "completed") return;
      if (isProcessing || downloadUrl) return;

      setIsProcessing(true);
      try {
        await actor.markOrderAsPaid(orderId, sessionId);
        const blob = await actor.getOrderDownloadLink(orderId);
        if (blob) {
          setDownloadUrl(blob.getDirectURL());
        } else {
          setError("Download link not available yet. Please contact support.");
        }
      } catch (err) {
        console.error(err);
        setError(
          "There was an issue processing your order. Please contact support.",
        );
      } finally {
        setIsProcessing(false);
      }
    }
    processOrder();
  }, [sessionStatus, actor, orderId, sessionId, isProcessing, downloadUrl]);

  const isLoading =
    !sessionStatus ||
    (sessionStatus.__kind__ !== "completed" &&
      sessionStatus.__kind__ !== "failed");
  const isFailed = sessionStatus?.__kind__ === "failed";

  return (
    <main className="container mx-auto px-4 py-20 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Loading state */}
        {isLoading && (
          <div data-ocid="download.loading_state">
            <div className="text-5xl mb-6">✨</div>
            <h1 className="font-display font-black text-3xl mb-3">
              Processing Your Order...
            </h1>
            <p className="text-muted-foreground mb-8">
              Hang tight! We're confirming your payment.
            </p>
            <Progress className="max-w-xs mx-auto mb-6" value={undefined} />
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        )}

        {/* Failed state */}
        {isFailed && (
          <div data-ocid="download.error_state">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-display font-black text-3xl mb-3">
              Payment Failed
            </h1>
            <p className="text-muted-foreground mb-8">
              {sessionStatus?.__kind__ === "failed"
                ? sessionStatus.failed.error
                : "Your payment could not be processed."}
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        )}

        {/* Error state */}
        {error && !isFailed && (
          <div data-ocid="download.error_state">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="font-display font-bold text-2xl mb-2">Oops!</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Success + download */}
        {!isLoading && !isFailed && !error && (
          <div data-ocid="download.success_state">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-6xl mb-6"
            >
              🎉
            </motion.div>
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-display font-black text-3xl md:text-4xl mb-3">
              Yay! Your stickers are ready! 💕
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Thank you for your purchase! Your download link is ready. Check
              your email too — we sent a copy there.
            </p>

            {isProcessing && (
              <div className="flex justify-center mb-6">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {downloadUrl ? (
              <Button
                asChild
                size="lg"
                data-ocid="download.primary_button"
                className="rounded-full font-bold px-10 mb-4"
              >
                <a href={downloadUrl} download>
                  <Download className="mr-2 h-5 w-5" />
                  Download Your Stickers ✨
                </a>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                Preparing your download...
              </p>
            )}

            <div className="mt-6">
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
