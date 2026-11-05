"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold text-nimora-navy">
        Something went wrong
      </h1>
      <p className="max-w-md text-nimora-slate">
        We could not load this page. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-nimora-navy px-5 py-2.5 font-medium text-nimora-ivory transition-colors duration-200 hover:bg-nimora-slate"
      >
        Try again
      </button>
    </main>
  );
}
