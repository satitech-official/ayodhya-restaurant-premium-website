export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 40 V21 C8 21 22 8 22 8 C22 8 36 21 36 21 V40"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 40 V23 C14 23 22 14.5 22 14.5 C22 14.5 30 23 30 23 V40"
        stroke="var(--color-brass)"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="22" cy="5.4" r="2.1" fill="var(--color-brass)" />
    </svg>
  );
}

export function LogoLockup({ dark = false, compact = false }) {
  const main = dark ? "text-soft" : "text-charcoal";
  const sub = dark ? "text-cream/60" : "text-walnut/70";
  return (
    <span className="flex items-center gap-3">
      <span className={dark ? "text-burnt" : "text-terracotta"}>
        <LogoMark className={compact ? "h-8 w-8" : "h-9 w-9"} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-[1.35rem] font-semibold tracking-[0.18em] ${main}`}>
          AYODHYA
        </span>
        {!compact && (
          <span className={`mt-1 text-[9px] font-bold uppercase tracking-[0.34em] ${sub}`}>
            Restaurant · Betul
          </span>
        )}
      </span>
    </span>
  );
}
