'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  ErrorState,
  Field,
  inputClass,
  LoadingState,
  PageHeader,
  selectClass,
} from '@/components/ui/common';
import { useDoctor, useSaveDoctor } from '@/hooks/use-api';
import { ApiRequestError } from '@/lib/api';
import { SPECIALIZATIONS } from '@/lib/constants';
import type { DoctorInput } from '@/lib/types';

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{6,19}$/;

const doctorSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  specialization: z.enum(SPECIALIZATIONS),
  hospital: z.string().trim().max(150),
  phone: z.string().trim().refine((value) => value === '' || PHONE_PATTERN.test(value), {
    message: 'Enter a valid phone number',
  }),
  email: z.string().trim().refine((value) => value === '' || z.email().safeParse(value).success, {
    message: 'Enter a valid email address',
  }),
  isActive: z.boolean(),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

const EMPTY_VALUES: DoctorFormValues = {
  name: '',
  specialization: 'General Medicine',
  hospital: '',
  phone: '',
  email: '',
  isActive: true,
};

function toFormValues(values: DoctorInput): DoctorFormValues {
  return {
    name: values.name,
    specialization: values.specialization as DoctorFormValues['specialization'],
    hospital: values.hospital ?? '',
    phone: values.phone ?? '',
    email: values.email ?? '',
    isActive: values.isActive,
  };
}

export function DoctorForm({ id }: { id?: string }) {
  const router = useRouter();
  const { data: doctor, isPending, isError, error, refetch } = useDoctor(id ?? '');
  const save = useSaveDoctor(id);
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (doctor) form.reset(toFormValues(doctor));
  }, [doctor, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await save.mutateAsync({
        name: values.name,
        specialization: values.specialization,
        hospital: values.hospital,
        phone: values.phone,
        email: values.email,
        isActive: values.isActive,
      });
      toast.success(id ? 'Doctor updated' : 'Doctor created');
      router.push('/doctors');
    } catch (error) {
      if (error instanceof ApiRequestError) {
        for (const issue of error.errors) {
          if (issue.field in values) {
            form.setError(issue.field as keyof DoctorFormValues, { message: issue.message });
          }
        }
      }
      toast.error(error instanceof Error ? error.message : 'Could not save the doctor');
    }
  });

  if (id && isPending) return <LoadingState label="Loading doctor…" />;
  if (id && (isError || !doctor)) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Could not load this doctor'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={id ? 'Edit doctor' : 'Add doctor'}
        description={id ? 'Update the details of this doctor.' : 'Add a new doctor to your clinic.'}
      />

      <form onSubmit={onSubmit} noValidate className="max-w-2xl rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={form.formState.errors.name?.message}>
            <input
              className={inputClass}
              placeholder="Dr. Jane Smith"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register('name')}
            />
          </Field>
          <Field label="Specialization" error={form.formState.errors.specialization?.message}>
            <select
              className={selectClass}
              aria-invalid={Boolean(form.formState.errors.specialization)}
              {...form.register('specialization')}
            >
              {SPECIALIZATIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hospital" error={form.formState.errors.hospital?.message}>
            <input className={inputClass} placeholder="Optional" {...form.register('hospital')} />
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <input className={inputClass} placeholder="+1 555 1234567" {...form.register('phone')} />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input
              type="email"
              className={inputClass}
              placeholder="Optional"
              {...form.register('email')}
            />
          </Field>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" className="size-4" {...form.register('isActive')} />
            Available for new patients
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {id ? 'Save changes' : 'Create doctor'}
          </Button>
          <Link href="/doctors" className={buttonVariants({ variant: 'outline' })}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
