import type { ReactNode } from "react";

const tones = {
  success: "bg-nimora-success-bg text-nimora-success-ink",
  warning: "bg-nimora-warning-bg text-nimora-warning-ink",
  danger: "bg-nimora-danger-bg text-nimora-danger",
  neutral: "bg-nimora-neutral-bg text-primary",
} as const;

export type StatusTone = keyof typeof tones;

export function StatusBadge({ tone = "neutral", children }: { tone?: StatusTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
