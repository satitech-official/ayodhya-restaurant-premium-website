import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Ayodhya Restaurant, Betul.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-cream pb-24 pt-28 lg:pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-terracotta">
          <span className="h-px w-8 bg-current opacity-60" /> Legal
        </p>
        <h1 className="font-display text-5xl font-semibold text-charcoal">Privacy Policy</h1>
        <div className="prose prose-lg mt-8 max-w-none text-walnut [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-charcoal">
          <p>
            At Ayodhya Restaurant, Betul, we respect your privacy. This page explains what
            information we collect when you use this website and how we use it.
          </p>
          <h2>Information we collect</h2>
          <p>
            When you make a reservation or send us a message, we collect the details you provide —
            such as your name, phone number, email and any special requests — solely to manage your
            booking or respond to your enquiry.
          </p>
          <h2>How we use it</h2>
          <p>
            Your details are used only to confirm reservations and answer your messages. We do not
            sell or share your information with third parties for marketing.
          </p>
          <h2>Third-party services</h2>
          <p>
            Our site may embed content from Google Maps and link to Instagram, Zomato and Swiggy.
            These services operate under their own privacy policies.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about this policy? Call us or use the <Link href="/contact" className="font-semibold text-terracotta underline">contact form</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
