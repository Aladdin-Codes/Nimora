import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  ClipboardList,
  Eye,
  FolderOpen,
  LockKeyhole,
  Sprout,
  Syringe,
  TrendingUp,
} from "lucide-react";
import { BRAND } from "@/config/brand";

const childHealthFeatures = [
  {
    icon: TrendingUp,
    title: "Growth tracking",
    description: "Record weight, height and head circumference, then see how each measurement changes over time.",
  },
  {
    icon: Syringe,
    title: "Vaccination schedule",
    description: "See which doses have been given, what is due next, and when it is time to book.",
  },
];

const generalHealthFeatures = [
  {
    icon: ClipboardList,
    title: "Health records",
    description: "Keep notes, diagnoses and visit summaries in one timeline for each child.",
  },
  {
    icon: CalendarClock,
    title: "Appointments",
    description: "Keep upcoming check-ups and clinic visits in view, with the details you need.",
  },
  {
    icon: FolderOpen,
    title: "Documents",
    description: "Store letters, prescriptions and reports next to the records they belong to.",
  },
  {
    icon: Bell,
    title: "Reminders",
    description: "Get a gentle nudge before a dose or appointment is due.",
  },
];

const steps = [
  {
    title: "Create a child profile",
    description: "Start with the basics: name, date of birth, and who you care for.",
  },
  {
    title: "Log what matters",
    description: "Add measurements, vaccinations, visits and documents as they happen.",
  },
  {
    title: "Invite caregivers",
    description: "Give trusted adults read-only access, and remove it whenever you choose.",
  },
];

const accessPoints = [
  {
    title: "Owners manage the profile",
    description: "Only the owner edits a child’s details and adds or removes caregivers.",
  },
  {
    title: "Caregivers are read-only",
    description: "Invited caregivers can view the profile but cannot change it.",
  },
  {
    title: "Access can be removed",
    description: "Revoke a caregiver at any time from the child’s profile page.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <header className="relative z-10 mx-auto flex min-h-16 max-w-[90rem] items-center justify-between gap-4 px-5 sm:px-8 lg:min-h-[4.5rem] lg:px-12">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 sm:gap-7">
          <Link href="#features" className="hidden min-h-10 items-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:inline-flex">Features</Link>
          <Link href="#how-it-works" className="hidden min-h-10 items-center text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline sm:inline-flex">How it works</Link>
          <Link href="/login" className="min-h-10 content-center text-sm font-medium text-primary underline-offset-4 hover:underline">Sign in</Link>
          <Link href="/signup" className="inline-flex min-h-10 items-center gap-2 rounded-sm bg-nimora-clay px-4 text-sm font-semibold text-white transition-colors hover:bg-nimora-clay/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nimora-clay">
            Get started <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </nav>
      </header>

      <section className="relative isolate overflow-hidden bg-nimora-navy text-nimora-ivory">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgb(66_169_149/0.28),transparent_40%),radial-gradient(circle_at_0%_100%,rgb(199_123_85/0.16),transparent_35%)]"
        />
        <div className="mx-auto grid max-w-[90rem] gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:py-24">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase text-nimora-sage">
              <span className="h-px w-8 bg-nimora-clay" /> Child health, organized
            </p>
            <h1 className="mt-5 font-heading text-[2.75rem] font-semibold leading-[1.05] text-white sm:text-6xl">
              Keep every child’s health story in one calm place.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/75 sm:text-base">
              NIMORA helps parents and guardians follow growth, vaccinations, appointments and records for each child, and share view-only access with trusted caregivers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/signup" className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-nimora-teal px-5 text-sm font-semibold text-nimora-navy transition-colors hover:bg-nimora-sage focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Create your account <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link href="#features" className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Explore features <ArrowDownRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <p className="mt-9 border-l-2 border-nimora-clay pl-3 font-heading text-sm font-medium text-white/80">{BRAND.tagline}</p>
          </div>

          <ProfilePreview />
        </div>
      </section>

      <section aria-label="A family in everyday care" className="bg-background">
        <div className="mx-auto max-w-[90rem] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-16">
          <Image
            src="/images/family-illustration.svg"
            alt="A parent holding a toddler's hand in a bright, sunlit room"
            width={1200}
            height={720}
            unoptimized
            sizes="(min-width: 1440px) 1200px, 100vw"
            className="h-auto w-full rounded-lg border border-border shadow-xl"
          />
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="bg-background">
        <div className="mx-auto max-w-[90rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase text-nimora-slate">What NIMORA covers</p>
            <h2 id="features-heading" className="mt-3 font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              Child health monitoring, with the everyday health tools around it.
            </h2>
          </div>

          <div className="mt-12">
            <p className="text-xs font-semibold uppercase text-nimora-slate">Child health</p>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {childHealthFeatures.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-6 sm:p-8">
                  <span className="grid size-12 place-items-center rounded-md bg-nimora-sage text-nimora-navy">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-semibold text-primary">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <p className="text-xs font-semibold uppercase text-nimora-slate">General health</p>
            <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {generalHealthFeatures.map(({ icon: Icon, title, description }) => (
                <article key={title} className="bg-card p-6">
                  <Icon aria-hidden="true" className="size-5 text-nimora-teal" />
                  <h3 className="mt-4 font-heading text-base font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" aria-labelledby="how-heading" className="border-y border-border bg-nimora-sage/30">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase text-nimora-slate">How it works</p>
            <h2 id="how-heading" className="mt-3 font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              Three steps to a clearer family health space.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Begin with one profile, then keep adding measurements, records and visits as they come up.
            </p>
          </div>
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map(({ title, description }, index) => (
              <li key={title} className="border-t-2 border-nimora-teal pt-5">
                <p className="font-heading text-sm font-semibold text-nimora-clay">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-heading text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="privacy-heading" className="bg-nimora-navy text-nimora-ivory">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-nimora-sage">
              <LockKeyhole aria-hidden="true" className="size-4" /> Access and privacy
            </p>
            <h2 id="privacy-heading" className="mt-3 font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
              You decide who can see each profile.
            </h2>
            <ul className="mt-8 space-y-6">
              {accessPoints.map(({ title, description }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-nimora-teal/20">
                    <Check aria-hidden="true" className="size-4 text-nimora-teal" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden="true" className="rounded-lg bg-white p-6 text-nimora-navy sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-nimora-slate/15 pb-4">
              <p className="font-heading text-lg font-semibold">Caregiver access</p>
              <span className="rounded-sm bg-nimora-sage px-2.5 py-1 text-[11px] font-semibold">Example</span>
            </div>
            <ul className="divide-y divide-nimora-slate/15">
              <li className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold">Grandparent</p>
                  <p className="mt-0.5 text-xs text-nimora-slate">Viewing Ava’s profile</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-nimora-ivory px-2.5 py-1 text-xs font-medium">
                  <Eye className="size-3.5 text-nimora-teal" /> Read-only
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-semibold">Childminder</p>
                  <p className="mt-0.5 text-xs text-nimora-slate">Viewing Ava’s profile</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-sm bg-nimora-ivory px-2.5 py-1 text-xs font-medium">
                  <Eye className="size-3.5 text-nimora-teal" /> Read-only
                </span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-nimora-slate">Access can be removed at any time.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="bg-background">
        <div className="mx-auto flex max-w-[90rem] flex-col items-start justify-between gap-8 px-5 py-16 sm:px-8 md:flex-row md:items-center lg:px-12 lg:py-20">
          <div className="max-w-2xl">
            <h2 id="cta-heading" className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              Start with one child. Add the rest later.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Create your account and set up your first child profile.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/signup" className="inline-flex min-h-12 items-center gap-3 rounded-sm bg-nimora-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nimora-navy">
              Get started <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/login" className="inline-flex min-h-12 items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <p className="mx-auto max-w-[90rem] px-5 pt-6 text-xs leading-5 text-muted-foreground sm:px-8 lg:px-12">
          NIMORA helps you organize and track health information. It does not diagnose conditions or replace advice from your doctor or nurse. In an emergency, contact your local emergency number.
        </p>
        <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-bold text-primary">
              <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{BRAND.tagline}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="#features" className="inline-flex min-h-10 items-center text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Features</Link>
            <Link href="#how-it-works" className="inline-flex min-h-10 items-center text-muted-foreground underline-offset-4 hover:text-primary hover:underline">How it works</Link>
            <Link href="/login" className="inline-flex min-h-10 items-center text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Sign in</Link>
            <Link href="/signup" className="inline-flex min-h-10 items-center text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Create account</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function ProfilePreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md">
      <div className="rounded-lg bg-nimora-ivory p-5 text-nimora-navy shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-nimora-slate/15 pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase text-nimora-slate">Example profile</p>
            <p className="mt-1 font-heading text-xl font-semibold">Ava, 18 months</p>
          </div>
          <span className="grid size-10 place-items-center rounded-full bg-nimora-navy font-heading text-sm font-semibold text-nimora-ivory">A</span>
        </div>

        <div className="grid grid-cols-3 divide-x divide-nimora-slate/15 py-4 text-center">
          <div className="px-2">
            <p className="text-[11px] font-semibold uppercase text-nimora-slate">Weight</p>
            <p className="mt-1 font-heading text-lg font-semibold">11.2 kg</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] font-semibold uppercase text-nimora-slate">Height</p>
            <p className="mt-1 font-heading text-lg font-semibold">82 cm</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] font-semibold uppercase text-nimora-slate">Head</p>
            <p className="mt-1 font-heading text-lg font-semibold">47 cm</p>
          </div>
        </div>

        <div className="rounded-md bg-white p-4">
          <div className="flex items-center justify-between text-xs">
            <p className="font-semibold">Weight, last 6 months</p>
            <p className="font-semibold text-nimora-teal">+1.4 kg</p>
          </div>
          <svg viewBox="0 0 240 96" className="mt-3 h-auto w-full">
            <line x1="0" x2="240" y1="32" y2="32" stroke="currentColor" strokeDasharray="3 4" className="text-nimora-slate/20" />
            <polygon points="0,78 48,70 96,64 144,56 192,50 240,42 240,96 0,96" className="fill-nimora-teal/15" />
            <polyline points="0,78 48,70 96,64 144,56 192,50 240,42" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" className="text-nimora-teal" />
            <circle cx="240" cy="42" r="4.5" className="fill-nimora-clay" />
          </svg>
          <div className="mt-1 flex justify-between text-[11px] text-nimora-slate">
            <span>6 months ago</span>
            <span>Today</span>
          </div>
        </div>

        <ul className="mt-4 divide-y divide-nimora-slate/15">
          <li className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-nimora-sage">
              <Syringe className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Booster dose</p>
              <p className="text-xs text-nimora-slate">Vaccination</p>
            </div>
            <p className="text-xs font-semibold text-nimora-clay">In 3 weeks</p>
          </li>
          <li className="flex items-center gap-3 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-nimora-sage">
              <CalendarClock className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Well-child check</p>
              <p className="text-xs text-nimora-slate">Appointment</p>
            </div>
            <p className="text-xs font-semibold text-nimora-slate">Thu, 9:30</p>
          </li>
        </ul>

        <div className="flex items-center justify-between gap-3 border-t border-nimora-slate/15 pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-nimora-slate">
            <Eye className="size-4 text-nimora-teal" /> Caregiver view: read-only
          </span>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-md bg-white px-4 py-3 text-nimora-navy shadow-xl sm:-left-8">
        <span className="grid size-8 place-items-center rounded-full bg-nimora-clay/15">
          <Bell className="size-4 text-nimora-clay" />
        </span>
        <div>
          <p className="text-xs font-semibold">Reminder scheduled</p>
          <p className="text-[11px] text-nimora-slate">One week before the booster</p>
        </div>
      </div>
    </div>
  );
}
