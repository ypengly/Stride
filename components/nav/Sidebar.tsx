"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/ui/Logo";
import { HomeIcon, ActivityIcon, StatsIcon, ProfileIcon, PlusIcon } from "./icons";

const items = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/history", label: "History", Icon: ActivityIcon },
  { href: "/stats", label: "Stats", Icon: StatsIcon },
  { href: "/profile", label: "Profile", Icon: ProfileIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-bg-raised/60 px-5 py-6 md:flex">
      <Link href="/" className="px-2">
        <Logo className="text-xl" />
      </Link>

      <Link
        href="/activity/live"
        className="mt-8 flex items-center justify-center gap-2 rounded-xl2 bg-ember px-4 py-3 font-display text-sm font-semibold text-[#170a04] shadow-glow transition-transform active:scale-[0.98]"
      >
        <PlusIcon className="h-4 w-4" />
        Start Activity
      </Link>

      <nav aria-label="Primary" className="mt-8 flex flex-col gap-1">
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-bg-elevated text-ink" : "text-ink-dim hover:bg-bg-elevated/60 hover:text-ink"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl2 border border-line bg-bg-elevated/60 p-4 text-xs text-ink-faint">
        Keep the browser tab active while tracking — GPS and step data pause if it's backgrounded.
      </div>
    </aside>
  );
}
