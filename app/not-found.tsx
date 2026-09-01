import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Trace } from "@/components/ui/Trace";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <Trace className="mb-4 h-8 w-32 text-ink-faint" />
      <h1 className="font-display text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-dim">The page you're looking for doesn't exist or moved.</p>
      <Link href="/">
        <Button className="mt-6">Back to dashboard</Button>
      </Link>
    </div>
  );
}
