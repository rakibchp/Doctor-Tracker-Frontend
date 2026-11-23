import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/common';
import { DoctorForm } from '../doctor-form';

export const metadata: Metadata = { title: 'Add doctor' };

export default function Page() {
  return (
    <Suspense fallback={<LoadingState label="Loading form…" />}>
      <DoctorForm />
    </Suspense>
  );
}
