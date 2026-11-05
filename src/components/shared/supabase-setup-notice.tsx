import Link from "next/link";
import { Sprout } from "lucide-react";
import { BRAND } from "@/config/brand";

export function SupabaseSetupNotice() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-lg border-y border-border py-8">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg font-bold text-primary">
          <Sprout aria-hidden="true" className="size-5 text-nimora-teal" /> {BRAND.name}
        </Link>
        <h1 className="mt-8 font-heading text-2xl font-semibold text-primary">Connect your family space</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Account features are waiting for a Supabase project. Add its URL and public key to your local environment, then reload this page.
        </p>
      </section>
    </main>
  );
}
