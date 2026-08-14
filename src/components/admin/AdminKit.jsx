"use client";

import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-sand bg-white px-3.5 py-2.5 text-sm text-espresso placeholder:text-walnut/40 transition focus:border-terracotta focus:outline-none";
export const labelCls = "mb-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-walnut";

export function Card({ children, className }) {
  return (
    <div className={cn("rounded-2xl bg-soft p-5 ring-1 ring-sand/60", className)}>{children}</div>
  );
}

export function PageHead({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold text-charcoal">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-walnut">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Btn({ children, variant = "primary", className, ...props }) {
  const variants = {
    primary: "bg-terracotta text-soft hover:bg-burnt",
    dark: "bg-charcoal text-soft hover:bg-espresso",
    outline: "border border-sand bg-white text-walnut hover:border-terracotta hover:text-terracotta",
    ghost: "text-walnut hover:text-terracotta",
    danger: "bg-[#a33]/0 text-terracotta hover:bg-terracotta/10",
  };
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl bg-soft p-5 ring-1 ring-sand/60">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-walnut/80">{label}</p>
      <p className={cn("mt-2 font-display text-4xl font-semibold", accent || "text-charcoal")}>
        {value}
      </p>
    </div>
  );
}
