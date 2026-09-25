"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Star } from "lucide-react";
import { RESTAURANT } from "@/lib/constants";

export default function GoogleReviewForm() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [opened, setOpened] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const text = review.trim();
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Google review page still opens if clipboard access is unavailable.
      }
    }

    window.open(RESTAURANT.googleReviewUrl, "_blank", "noopener,noreferrer");
    setOpened(true);
  }

  return (
    <div className="mt-12 grid gap-6 rounded-[1.5rem] border border-brass/20 bg-espresso/55 p-6 text-left shadow-[0_25px_80px_-55px_rgba(0,0,0,.95)] backdrop-blur-sm md:grid-cols-[.8fr_1.2fr] md:p-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-brass">Share Your Experience</p>
        <h3 className="mt-3 font-display text-3xl text-soft">Leave a Google Review</h3>
        <p className="mt-3 text-sm leading-7 text-cream/60">
          Choose your rating and write your feedback. We’ll copy your message and open the official
          Google review window so you can post it from your Google account.
        </p>
        <div className="mt-5 flex items-center gap-2 text-xs text-cream/45">
          <CheckCircle2 className="h-4 w-4 text-brass" />
          Direct Google review link
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[1.2rem] border border-brass/15 bg-charcoal/55 p-5">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-cream/65">Your rating</label>
        <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Google review rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="rounded-lg p-1.5 transition hover:bg-brass/10"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
            >
              <Star
                className={`h-7 w-7 ${value <= rating ? "fill-brass text-brass" : "text-cream/20"}`}
              />
            </button>
          ))}
        </div>

        <label htmlFor="google-review-text" className="mt-5 block text-xs font-bold uppercase tracking-[0.18em] text-cream/65">
          Your review
        </label>
        <textarea
          id="google-review-text"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          rows={4}
          required
          placeholder="Tell others what you enjoyed about your visit..."
          className="mt-3 w-full resize-none rounded-xl border border-brass/20 bg-espresso/55 px-4 py-3 text-sm leading-6 text-soft placeholder:text-cream/30 outline-none transition focus:border-brass"
        />

        <button
          type="submit"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brass px-5 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-charcoal transition hover:bg-burnt"
        >
          Continue to Google <ExternalLink className="h-4 w-4" />
        </button>

        {opened && (
          <p className="mt-3 text-xs leading-5 text-cream/50">
            Your text was copied. Paste it into the Google review box, select the same rating, and post.
          </p>
        )}
      </form>
    </div>
  );
}
