import Link from 'next/link';
import type { Metadata } from 'next';
import { HeartPulse } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="bg-muted/40 flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
        <HeartPulse className="size-6" />
      </span>
      <p className="text-muted-foreground mt-6 text-sm font-medium">404</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm">
        The page you are looking for does not exist or has moved.
      </p>
      <Link href="/dashboard" className={`${buttonVariants()} mt-6`}>
        Go to dashboard
      </Link>
    </main>
  );
}
