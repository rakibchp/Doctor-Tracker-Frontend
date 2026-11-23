import type { Metadata } from 'next';
import { Suspense, type ReactNode } from 'react';

export const metadata: Metadata = { title: 'Sign in' };

export default function Layout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>{children}</Suspense>;
}
