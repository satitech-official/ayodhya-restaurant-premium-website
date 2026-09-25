export function LogoMark({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Design 7 inspired golden flourish */}
      <path
        d="M7 42 C16 30 26 27 36 31 C43 34 47 31 48 22 C49 13 45 8 40 5"
        stroke="var(--color-brass)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 43 C19 49 32 49 45 43"
        stroke="var(--color-brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Red tilak / flame accent from concept 7 */}
      <path
        d="M23 13 C21 21 19 29 20 37 C20 41 22.3 44 25 46 C27.7 44 30 41 30 37 C31 29 29 21 27 13 L25 9 Z"
        fill="var(--color-burnt)"
      />
      <path
        d="M25 34 C22.8 37 22.8 39.5 25 42 C27.2 39.5 27.2 37 25 34 Z"
        fill="var(--color-charcoal)"
      />

      {/* Small bell */}
      <path
        d="M47 35 C47 31 49.3 28 53 27 C56.7 28 59 31 59 35 L59 39 H47 Z"
        fill="var(--color-brass)"
      />
      <path d="M45.5 40 H60.5" stroke="var(--color-brass)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="53" cy="42.5" r="1.8" fill="var(--color-brass)" />
      <path d="M53 25 V21" stroke="var(--color-brass)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function LogoLockup({ dark = false, compact = false }) {
  const main = dark ? "text-brass" : "text-espresso";
  const sub = dark ? "text-cream/65" : "text-walnut/75";

  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-9 w-9" : "h-11 w-11"} />
      <span className="relative flex flex-col leading-none">
        <span
          className={`font-display text-[1.62rem] font-semibold italic tracking-[-0.025em] sm:text-[1.72rem] ${main}`}
        >
          Ayodhya
        </span>
        <svg
          viewBox="0 0 118 8"
          className="mt-0.5 h-1.5 w-[112px] text-brass"
          aria-hidden="true"
        >
          <path
            d="M2 4 C28 1 50 7 74 4 C91 2 103 2 116 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
        {!compact && (
          <span className={`mt-0.5 text-[8px] font-bold uppercase tracking-[0.31em] ${sub}`}>
            Restaurant · Betul
          </span>
        )}
      </span>
    </span>
  );
}
