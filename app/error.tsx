"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Trace } from "@/components/ui/Trace";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Trace className="mb-4 h-8 w-32 text-danger/60" />
      <h1 className="font-display text-xl font-semibold text-ink">Something interrupted this page</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-dim">
        Your saved activities are untouched — this was just a hiccup loading the screen. Try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
