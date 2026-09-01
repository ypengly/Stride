import clsx from "clsx";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2 font-display font-bold tracking-tight", className)}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 18 C 6 18, 7 8, 11 8 S 14 20, 18 20 S 20 6, 22 6"
          stroke="#FF6A3D"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
      <span>Stride</span>
    </span>
  );
}
