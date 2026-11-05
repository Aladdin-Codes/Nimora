"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, FileText, LayoutDashboard, LogOut, Ruler, Sprout, Syringe, UserPlus, UserRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BRAND } from "@/config/brand";
import { signOut } from "@/features/authentication/actions";

const primaryNavigation: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/children/new", label: "Add child", icon: UserPlus },
  { href: "/onboarding", label: "Your profile", icon: UserRound },
];

const comingSoonNavigation: { label: string; icon: LucideIcon }[] = [
  { label: "Growth", icon: Ruler },
  { label: "Vaccinations", icon: Syringe },
  { label: "Appointments", icon: CalendarDays },
  { label: "Documents", icon: FileText },
  { label: "Notifications", icon: Bell },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1">
      {primaryNavigation.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ComingSoonLinks() {
  return (
    <ul aria-label="Coming soon" className="flex flex-col gap-1">
      {comingSoonNavigation.map(({ label, icon: Icon }) => (
        <li key={label} aria-disabled="true" className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-sm text-muted-foreground/70">
          <span className="inline-flex items-center gap-3">
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {label}
          </span>
          <span className="rounded-sm bg-nimora-neutral-bg px-2 py-0.5 text-xs text-muted-foreground">Soon</span>
        </li>
      ))}
    </ul>
  );
}

function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {primaryNavigation.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring ${active ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon aria-hidden="true" className={`size-5 ${active ? "text-nimora-teal-ink" : ""}`} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutButton() {
  return (
    <form action={signOut}>
      <button className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <LogOut aria-hidden="true" className="size-4" />
        Sign out
      </button>
    </form>
  );
}

export function AppShell({ children, fullName }: { children: ReactNode; fullName: string }) {
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-card px-4 py-2 text-sm font-medium text-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-2 focus:outline-ring"
      >
        Skip to content
      </a>

      <aside className="hidden border-r border-border bg-card px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <Link href="/dashboard" className="mb-10 inline-flex min-h-11 items-center gap-2 rounded-md px-2 font-heading text-lg font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal-ink" /> {BRAND.name}
        </Link>
        <SidebarLinks />
        <div className="mt-8">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-nimora-slate">Coming soon</p>
          <ComingSoonLinks />
        </div>
        <div className="mt-auto border-t border-border pt-4">
          <p className="truncate px-3 pb-2 text-xs text-muted-foreground" title={fullName}>{fullName}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur lg:hidden">
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 font-heading font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Sprout aria-hidden="true" className="size-5 text-nimora-teal-ink" /> {BRAND.name}
          </Link>
          <SignOutButton />
        </header>

        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-12">
          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
