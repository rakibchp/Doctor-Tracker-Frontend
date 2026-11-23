import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-muted/40 min-h-screen antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <p className="text-muted-foreground text-sm font-medium">404</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm">
            The page you are looking for does not exist or has moved.
          </p>
          <Link href="/" className={`${buttonVariants()} mt-6`}>
            Go home
          </Link>
        </main>
      </body>
    </html>
  );
}
