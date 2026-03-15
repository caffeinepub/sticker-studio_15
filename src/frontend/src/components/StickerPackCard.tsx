import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/data/samplePacks";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

interface StickerPackCardProps {
  id: string;
  name: string;
  description: string;
  priceCents: number | bigint;
  categoryTags: string[];
  image: string;
  index: number;
}

export function StickerPackCard({
  id,
  name,
  description,
  priceCents,
  categoryTags,
  image,
  index,
}: StickerPackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      data-ocid={`product.item.${index + 1}`}
    >
      <Link to={`/product/${id}`} className="block group">
        <div className="card-float bg-card rounded-3xl overflow-hidden border border-border shadow-soft">
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-display font-bold text-lg leading-tight">
                {name}
              </h3>
              <span className="font-display font-bold text-primary whitespace-nowrap">
                {formatPrice(priceCents)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categoryTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs rounded-full capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
