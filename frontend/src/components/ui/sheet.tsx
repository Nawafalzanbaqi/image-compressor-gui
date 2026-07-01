"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Minimal accessible slide-over. Dependency-free (no Radix) to keep the offline
 * install slim. Traps nothing fancy but handles Escape, backdrop click, and
 * respects RTL/LTR via logical inset properties.
 */
interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "start" | "end";
  children: React.ReactNode;
}

export function Sheet({
  open,
  onClose,
  title,
  side = "end",
  children,
}: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-y-0 flex w-full max-w-sm flex-col bg-card shadow-card",
          side === "end" ? "end-0" : "start-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="text-base font-semibold">{title}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
