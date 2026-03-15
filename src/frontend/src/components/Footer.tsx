import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <span className="font-display font-bold text-xl">
                StickerDrop
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cute digital stickers for planners, students, and laptop lovers
              worldwide. 💕
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/shop"
                className="text-sm hover:text-primary transition-colors"
              >
                Shop All Packs
              </Link>
              <Link
                to="/about"
                className="text-sm hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
              We Promise
            </h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>⚡ Instant download after purchase</span>
              <span>🌍 Ships worldwide (digitally!)</span>
              <span>🔒 Secure payments via Stripe</span>
              <span>💌 Personal & commercial use</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>© {year} StickerDrop. All rights reserved.</span>
          <a
            href={utmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            Built with{" "}
            <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
