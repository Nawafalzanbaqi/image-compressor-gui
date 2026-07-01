import { Star } from "lucide-react";

/**
 * Product reviews. Gated by the `reviews` feature flag in options.json
 * (currently FALSE) — this component is only rendered where reviews are
 * enabled, and the /reviews route 404s while the flag is off. The module exists
 * so enabling the flag needs no new code.
 *
 * TODO(phase-2): fetch reviews from the backend + moderation workflow.
 */
interface Review {
  author: string;
  rating: number;
  body: string;
}

export function Reviews({ reviews = [] as Review[] }: { reviews?: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section aria-label="Reviews" className="space-y-4">
      {reviews.map((r, i) => (
        <article key={i} className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-1" aria-label={`${r.rating} / 5`}>
            {Array.from({ length: 5 }, (_, s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  s < r.rating ? "fill-accent text-accent" : "text-muted"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-2 text-sm">{r.body}</p>
          <p className="mt-1 text-xs text-muted-foreground">{r.author}</p>
        </article>
      ))}
    </section>
  );
}
