import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <h3 className="font-heading text-base font-semibold text-primary">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
