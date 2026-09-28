export function LogoMark({ className = "h-10 w-10" }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <span className={`relative inline-flex overflow-hidden rounded-full ${className}`}>
      <img
        src={`${basePath}/brand/ayodhya-submark.jpg`}
        alt=""
        aria-hidden="true"
        className="h-full w-full scale-[2.1] object-cover"
      />
    </span>
  );
}

export function LogoLockup({ dark = false, compact = false }) {
  const main = dark ? "text-brass" : "text-espresso";
  const sub = dark ? "text-cream/65" : "text-walnut/75";

  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-10 w-10" : "h-12 w-12"} />
      <span className="relative flex flex-col leading-none">
        <span className={`font-display text-[1.62rem] font-semibold tracking-[-0.025em] sm:text-[1.72rem] ${main}`}>
          Ayodhya
        </span>
        {!compact && (
          <>
            <span className="mt-1 h-px w-[104px] bg-gradient-to-r from-brass via-brass/70 to-transparent" />
            <span className={`mt-1 text-[8px] font-bold uppercase tracking-[0.27em] ${sub}`}>
              Restaurant · Betul
            </span>
          </>
        )}
      </span>
    </span>
  );
}
