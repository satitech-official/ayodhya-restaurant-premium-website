"use client";

import { useMemo } from "react";
import { computeOpenStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function OpenStatus({ hours, className, showDetail = true }) {
  const status = useMemo(() => computeOpenStatus(hours), [hours]);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
        status.isOpen
          ? "border-[#2e7d32]/40 bg-[#2e7d32]/10 text-[#2e7d32]"
          : "border-terracotta/40 bg-terracotta/10 text-terracotta",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2e7d32] opacity-60" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            status.isOpen ? "bg-[#2e7d32]" : "bg-terracotta",
          )}
        />
      </span>
      <span>{status.label}</span>
      {showDetail && status.detail && (
        <span className="hidden font-medium opacity-70 sm:inline">· {status.detail}</span>
      )}
    </span>
  );
}
