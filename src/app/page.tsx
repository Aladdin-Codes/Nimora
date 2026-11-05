import Link from "next/link";
import { ArrowDownRight, ArrowRight, Check, LockKeyhole, Plus, Sprout, UsersRound } from "lucide-react";
import { BRAND } from "@/config/brand";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <header className="relative z-10 mx-auto flex min-h-16 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-8 lg:min-h-[4.5rem] lg:px-12">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
        </Link>
        <nav aria-label="Account" className="flex items-center gap-4 sm:gap-7">
          <Link href="#how-it-works" className="hidden min-h-10 items-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:inline-flex">Our approach</Link>
          <Link href="/login" className="min-h-10 content-center text-sm font-medium text-primary underline-offset-4 hover:underline">Sign in</Link>
          <Link href="/signup" className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-nimora-clay px-4 text-sm font-semibold text-white transition-colors hover:bg-nimora-clay/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nimora-clay">
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden bg-nimora-navy text-nimora-ivory">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[11%] hidden w-px bg-white/10 xl:block" />
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 pb-8 pt-7 sm:px-8 lg:min-h-[36rem] lg:grid-cols-[minmax(19rem,0.85fr)_minmax(31rem,1.15fr)] lg:items-center lg:gap-10 lg:px-12 lg:py-12">
          <div className="relative z-10 max-w-2xl lg:py-8">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase text-nimora-sage">
              <span className="h-px w-8 bg-nimora-clay" /> A family care space
            </p>
            <h1 className="mt-5 max-w-[12ch] font-heading text-[2.75rem] font-semibold leading-[1.05] text-white sm:text-6xl">
              The whole care circle, on the same page.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/75 sm:text-base">
              NIMORA gives parents and guardians one clear place for family profiles, with trusted caregivers invited on your terms.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/signup" className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-nimora-teal px-5 text-sm font-semibold text-nimora-navy transition-colors hover:bg-nimora-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Create your account <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="#how-it-works" className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white">
                See how it works <ArrowDownRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <p className="mt-7 border-l-2 border-nimora-clay pl-3 font-heading text-sm font-medium text-white/80">{BRAND.tagline}</p>
          </div>

          <section aria-label="NIMORA family space preview" className="relative z-10 grid min-h-[18rem] grid-cols-[2.75rem_minmax(0,1fr)] bg-nimora-ivory text-nimora-navy sm:min-h-[21rem] sm:grid-cols-[3.5rem_minmax(0,1fr)] lg:min-h-[25rem]">
            <aside aria-hidden="true" className="flex flex-col items-center gap-5 border-r border-nimora-slate/15 bg-nimora-sage/55 py-4 sm:py-6">
              <span className="grid size-8 place-items-center bg-nimora-navy text-nimora-ivory"><UsersRound className="size-4" /></span>
              <span className="h-5 w-px bg-nimora-teal" />
              <span className="h-5 w-px bg-nimora-slate/20" />
              <span className="h-5 w-px bg-nimora-slate/20" />
            </aside>
            <div className="flex min-w-0 flex-col px-4 py-4 sm:px-7 sm:py-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-nimora-slate/15 pb-3">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-nimora-slate"><Sprout aria-hidden="true" className="size-4 text-nimora-teal" /> Family space</p>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-nimora-slate"><LockKeyhole aria-hidden="true" className="size-3.5" /> Your choices come first</span>
              </div>
              <div className="my-auto py-5">
                <p className="text-xs font-semibold uppercase text-nimora-clay">A clear place to begin</p>
                <h2 className="mt-2 max-w-sm font-heading text-2xl font-semibold leading-tight sm:text-3xl">Your family, organized around you.</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-nimora-slate">Keep the essentials together. Add a caregiver when you’re ready.</p>
              </div>
              <div className="grid grid-cols-2 border-y border-nimora-slate/15">
                <div className="py-3 pr-3 sm:py-4 sm:pr-5">
                  <p className="text-[11px] font-semibold uppercase text-nimora-slate">Family profiles</p>
                  <p className="mt-1 font-heading text-sm font-semibold sm:text-base">One home for the basics</p>
                </div>
                <div className="border-l border-nimora-slate/15 py-3 pl-3 sm:py-4 sm:pl-5">
                  <p className="text-[11px] font-semibold uppercase text-nimora-slate">Care circle</p>
                  <p className="mt-1 font-heading text-sm font-semibold sm:text-base">Access set by you</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                <span className="inline-flex items-center gap-2 text-xs font-medium text-nimora-slate"><Check aria-hidden="true" className="size-4 text-nimora-teal" /> Caregivers are read-only</span>
                <span aria-hidden="true" className="inline-flex min-h-8 items-center gap-2 bg-nimora-navy px-3 text-xs font-semibold text-white"><Plus className="size-3.5" /> Add profile</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-[90rem] gap-7 px-5 py-7 sm:px-8 md:grid-cols-[minmax(11rem,0.7fr)_repeat(3,minmax(0,1fr))] md:gap-0 lg:px-12 lg:py-9" aria-label="NIMORA approach">
        <div className="flex items-start gap-3 md:pr-7">
          <span className="mt-1 h-8 w-1 shrink-0 bg-nimora-clay" />
          <p className="font-heading text-lg font-semibold leading-6 text-primary">Care, with a little more clarity.</p>
        </div>
        <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:px-5 md:pt-0 lg:px-7">
          <p className="text-xs font-semibold uppercase text-nimora-slate">01 / Gather</p>
          <p className="mt-2 text-sm leading-6 text-primary">Keep each child’s profile in one family space.</p>
        </div>
        <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:px-5 md:pt-0 lg:px-7">
          <p className="text-xs font-semibold uppercase text-nimora-slate">02 / Choose</p>
          <p className="mt-2 text-sm leading-6 text-primary">Invite caregivers only when you’re ready.</p>
        </div>
        <div className="border-t border-border pt-4 md:border-l md:border-t-0 md:px-5 md:pt-0 lg:px-7">
          <p className="text-xs font-semibold uppercase text-nimora-slate">03 / Share</p>
          <p className="mt-2 text-sm leading-6 text-primary">Keep caregiver access read-only by default.</p>
        </div>
      </section>
    </main>
  );
}
