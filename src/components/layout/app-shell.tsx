"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Sprout, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { BRAND } from "@/config/brand";
import { signOut } from "@/features/authentication/actions";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/onboarding", label: "Your profile", icon: UserRound },
];

function NavigationLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="flex gap-1 lg:flex-col">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
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
      <button className="inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <LogOut aria-hidden="true" className="size-4" />
        <span className="hidden sm:inline lg:inline">Sign out</span>
      </button>
    </form>
  );
}

export function AppShell({ children, fullName }: { children: ReactNode; fullName: string }) {
  return (
    <div className="min-h-dvh bg-background text-foreground lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border bg-card px-4 py-6 lg:flex lg:flex-col">
        <Link href="/dashboard" className="mb-10 inline-flex items-center gap-2 px-2 font-heading text-lg font-bold text-primary">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
        </Link>
        <NavigationLinks />
        <div className="mt-auto border-t border-border pt-4">
          <p className="truncate px-3 pb-3 text-xs text-muted-foreground" title={fullName}>{fullName}</p>
          <SignOutButton />
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-7 lg:hidden">
          <Link href="/dashboard" className="inline-flex items-center gap-2 font-heading font-bold text-primary">
            <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-36 truncate text-xs text-muted-foreground sm:inline">{fullName}</span>
            <SignOutButton />
          </div>
        </header>
        <div className="border-b border-border bg-background px-3 py-2 lg:hidden">
          <NavigationLinks />
        </div>
        <main className="mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pt-12">
          {children}
        </main>
      </div>
    </div>
  );
}
