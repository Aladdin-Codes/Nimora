import type { ReactNode } from "react";

export function SectionCard({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-border bg-card p-5 shadow-soft sm:p-6 ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-primary">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
