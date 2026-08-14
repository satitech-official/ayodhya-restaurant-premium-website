import Link from "next/link";

export const metadata = {
  title: "Terms",
  description: "Terms of use for the Ayodhya Restaurant, Betul website.",
};

export default function TermsPage() {
  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
          <span className="h-px w-8 bg-current opacity-60" /> Legal
        </p>
        <h1 className="font-display text-5xl font-semibold text-charcoal">Terms of Use</h1>
        <div className="prose prose-lg mt-8 max-w-none text-walnut [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-charcoal">
          <p>Welcome to the Ayodhya Restaurant website. By using this site you agree to these terms.</p>
          <h2>Reservations</h2>
          <p>
            A reservation request submitted through this site is not a confirmed booking until our
            team has confirmed it with you by phone or WhatsApp.
          </p>
          <h2>Menu & prices</h2>
          <p>
            Menu items, availability and prices shown here are indicative and may change. Please
            confirm current rates with the restaurant.
          </p>
          <h2>Content</h2>
          <p>
            Food photography and written content on this site belong to Ayodhya Restaurant or are
            used under licence. Please don't reproduce them without permission.
          </p>
          <h2>Contact</h2>
          <p>
            For questions, visit our <Link href="/contact" className="font-semibold text-terracotta underline">contact page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
