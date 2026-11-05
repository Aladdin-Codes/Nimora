import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function RecordPage({
  childId,
  childName,
  title,
  description,
  canManage,
  children,
}: {
  childId: string;
  childName: string;
  title: string;
  description: string;
  canManage: boolean;
  children: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Link href={`/dashboard?child=${childId}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft aria-hidden="true" className="size-4" /> Family overview
      </Link>
      <header className="mt-6 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase text-nimora-slate">{childName}</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      <section className="pt-7">
        {canManage ? (
          children
        ) : (
          <p className="border-l-2 border-nimora-slate pl-4 text-sm leading-6 text-muted-foreground">
            Only guardians can add records for this child. Caregivers have read-only access.
          </p>
        )}
      </section>
    </div>
  );
}
