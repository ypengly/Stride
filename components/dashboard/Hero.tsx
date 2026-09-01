import Link from "next/link";
import { Trace } from "@/components/ui/Trace";
import { PlusIcon } from "@/components/nav/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line px-5 py-10 md:px-8 md:py-14">
      <Trace
        className="pointer-events-none absolute -right-6 top-6 h-16 w-64 text-signal/30 md:w-96"
      />
      <div className="relative max-w-xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-signal">
          Walking · Running
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
          Track every step.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-dim md:text-base">
          Live GPS routes, pace, and steps — no account, no clutter. Just press
          start and go.
        </p>
        <Link
          href="/activity/live"
          className="mt-6 inline-flex h-14 items-center gap-2 rounded-xl2 bg-ember px-7 font-display text-base font-semibold text-[#170a04] shadow-glow transition-transform active:scale-[0.97]"
        >
          <PlusIcon className="h-5 w-5" />
          Start Activity
        </Link>
      </div>
    </section>
  );
}
