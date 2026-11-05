import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Sprout } from "lucide-react";
import { BRAND } from "@/config/brand";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[minmax(19rem,0.9fr)_minmax(30rem,1.1fr)]">
      <aside className="relative hidden min-h-dvh overflow-hidden bg-primary px-10 py-9 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
        <Link href="/" className="inline-flex w-fit items-center gap-2 font-heading text-lg font-bold">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal" />
          {BRAND.name}
        </Link>
        <div className="relative z-10 max-w-md pb-8">
          <p className="mb-5 text-xs font-semibold uppercase text-nimora-sage">A steadier way to care</p>
          <p className="font-heading text-4xl font-semibold leading-tight xl:text-5xl">
            Small moments. A fuller picture.
          </p>
          <p className="mt-5 max-w-sm text-base leading-7 text-white/75">
            Keep the people who care connected to the details that matter, all in one calm place.
          </p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-nimora-sage">
            Back to NIMORA <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-14 border-l border-white/10 bg-white/[0.03]" />
        <p className="text-xs text-white/55">{BRAND.tagline}</p>
      </aside>

      <section className="flex min-h-dvh flex-col px-6 py-6 sm:px-10 lg:px-14 xl:px-24">
        <div className="flex items-center justify-between lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <Sprout aria-hidden="true" className="size-5 text-nimora-teal" />
            {BRAND.name}
          </Link>
          <Link href="/" aria-label="Return to home" className="text-sm font-medium text-muted-foreground hover:text-foreground">Home</Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="text-xs font-semibold uppercase text-nimora-slate">{eyebrow}</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-normal text-primary sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="mx-auto w-full max-w-md pb-2 text-xs leading-5 text-muted-foreground">
          By continuing, you agree to use NIMORA thoughtfully and keep family information private.
        </p>
      </section>
    </main>
  );
}
