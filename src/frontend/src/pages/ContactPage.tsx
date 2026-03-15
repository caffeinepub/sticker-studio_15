import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/useQueries";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending } = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutateAsync({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Couldn't send your message. Please try again!");
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <p className="text-4xl mb-3">💌</p>
        <h1 className="font-display font-black text-4xl md:text-5xl mb-3">
          Say Hello!
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Have a question or just want to share the love? We'd love to hear from
          you!
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              data-ocid="contact.success_state"
              className="bg-accent/20 rounded-3xl p-10 text-center border border-border"
            >
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl mb-2">
                Message sent! 🎉
              </h2>
              <p className="text-muted-foreground">
                We'll get back to you within 24 hours. Thanks for reaching out!
              </p>
              <Button
                variant="outline"
                className="rounded-full mt-6"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl p-8 border border-border shadow-soft space-y-5"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Your Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sakura"
                  required
                  data-ocid="contact.input"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  required
                  data-ocid="contact.email_input"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-semibold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind! ✨"
                  required
                  rows={5}
                  data-ocid="contact.textarea"
                  className="rounded-xl resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                data-ocid="contact.submit_button"
                size="lg"
                className="w-full rounded-full font-bold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message 💌
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Alt contact */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            You can also reach us at{" "}
            <a
              href="mailto:hello@stickerdrop.shop"
              className="text-primary hover:underline font-medium"
            >
              hello@stickerdrop.shop
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
