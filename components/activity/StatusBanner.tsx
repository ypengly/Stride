import clsx from "clsx";

type Tone = "info" | "warn" | "danger";

export function StatusBanner({
  tone = "info",
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
}) {
  const toneClasses: Record<Tone, string> = {
    info: "border-signal/25 bg-signal/10 text-signal",
    warn: "border-warn/25 bg-warn/10 text-warn",
    danger: "border-danger/25 bg-danger/10 text-danger",
  };

  return (
    <div className={clsx("rounded-xl2 border px-4 py-3 text-sm", toneClasses[tone])}>
      <p className="font-semibold">{title}</p>
      {children && <p className="mt-0.5 text-ink-dim">{children}</p>}
    </div>
  );
}
