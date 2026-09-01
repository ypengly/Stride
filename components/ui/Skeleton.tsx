import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-shimmer rounded-lg bg-[linear-gradient(90deg,theme(colors.bg.elevated)_0%,theme(colors.line.DEFAULT)_50%,theme(colors.bg.elevated)_100%)] bg-[length:800px_100%]",
        className
      )}
      aria-hidden
    />
  );
}
