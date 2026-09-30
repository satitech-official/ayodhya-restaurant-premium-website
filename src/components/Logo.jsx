export function LogoMark({ className = "h-10 w-10" }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const src = `${basePath}/brand/ayodhya-submark-loader.webp`;

  return (
    <span className={`relative inline-flex overflow-hidden rounded-full border border-brass/10 bg-[#3b160a] shadow-[0_6px_20px_rgba(0,0,0,.22)] ${className}`}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

export function LogoLockup({ dark = false, compact = false }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const wordmark = `${basePath}/brand/ayodhya-hero-logo.webp`;

  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className={compact ? "h-10 w-10" : "h-12 w-12"} />
      <span className="relative flex items-center">
        <img
          src={wordmark}
          alt="Ayodhya Restaurant"
          className={compact ? "h-8 w-auto object-contain" : "h-10 w-auto object-contain sm:h-11"}
          loading="eager"
          decoding="async"
        />
      </span>
    </span>
  );
}
