import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { PatientForm } from '../patient-form';

export const metadata: Metadata = { title: 'Add patient' };

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Loading form…" />}>
      <PatientForm />
    </Suspense>
  );
}
