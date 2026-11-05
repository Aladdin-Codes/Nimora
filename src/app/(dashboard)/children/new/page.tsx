import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewChildForm } from "@/features/children/profile-forms";

export const instant = false;

export default function NewChildPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard" className="inline-flex min-h-9 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
        <ArrowLeft aria-hidden="true" className="size-4" /> Family overview
      </Link>
      <header className="mt-7 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase text-nimora-slate">Family profile</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary">Add a child</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Only details needed to identify the profile are requested.</p>
      </header>
      <section className="pt-7">
        <NewChildForm />
      </section>
    </div>
  );
}
