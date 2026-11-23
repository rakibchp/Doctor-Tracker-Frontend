import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { DoctorsView } from './doctors-view';

export const metadata: Metadata = { title: 'Doctors' };

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Loading doctors…" />}>
      <DoctorsView />
    </Suspense>
  );
}
