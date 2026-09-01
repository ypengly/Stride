import clsx from "clsx";

/**
 * "The Trace" — Stride's signature motif. A single continuous line that
 * looks like a GPS route sketch. Used in the logo, as a section divider,
 * and as the loading indicator, so the same idea (a path being drawn)
 * shows up everywhere the product talks about tracking a path.
 */
export function Trace({
  className,
  animate = true,
  color = "currentColor",
}: {
  className?: string;
  animate?: boolean;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 40"
      fill="none"
      className={clsx("overflow-visible", className)}
      aria-hidden
    >
      <path
        d="M2 30 C 20 30, 24 10, 42 10 S 64 32, 84 32 S 108 6, 130 6 S 156 34, 178 34 S 210 12, 238 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={animate ? 1000 : undefined}
        strokeDashoffset={animate ? 1000 : undefined}
        className={animate ? "animate-trace" : undefined}
      />
    </svg>
  );
}
