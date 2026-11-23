import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { PatientsView } from './patients-view';

export const metadata: Metadata = { title: 'Patients' };

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Loading patients…" />}>
      <PatientsView />
    </Suspense>
  );
}
