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
import { useDoctorOptions, usePatient, useSavePatient } from '@/hooks/use-api';
import { ApiRequestError } from '@/lib/api';
import { GENDERS, PATIENT_CONDITIONS } from '@/lib/constants';
import { toDateInputValue } from '@/lib/format';
import type { Patient } from '@/lib/types';

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{6,19}$/;
const DOCTOR_ID_PATTERN = /^[a-f\d]{24}$/i;

function isValidDateInput(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const patientSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  dateOfBirth: z
    .string()
    .refine(isValidDateInput, 'Enter a valid date')
    .refine(
      (value) => !isValidDateInput(value) || value >= '1900-01-01',
      'Date of birth is too far in the past',
    )
    .refine(
      (value) => !isValidDateInput(value) || value <= new Date().toISOString().slice(0, 10),
      'Date of birth cannot be in the future',
    ),
  gender: z.union([z.enum(GENDERS), z.literal('')]),
  phone: z.string().trim().refine((value) => value === '' || PHONE_PATTERN.test(value), {
    message: 'Enter a valid phone number',
  }),
  condition: z.enum(PATIENT_CONDITIONS),
  doctorId: z.string().regex(DOCTOR_ID_PATTERN, 'Choose an assigned doctor'),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const EMPTY_VALUES: PatientFormValues = {
  name: '',
  dateOfBirth: '',
  gender: '',
  phone: '',
  condition: 'Hypertension',
  doctorId: '',
};

function toFormValues(patient: Patient): PatientFormValues {
  return {
    name: patient.name,
    dateOfBirth: toDateInputValue(patient.dateOfBirth),
    gender: patient.gender ?? '',
    phone: patient.phone ?? '',
    condition: patient.condition as PatientFormValues['condition'],
    doctorId: patient.doctorId ?? '',
  };
}

export function PatientForm({ id }: { id?: string }) {
  const router = useRouter();
  const { data: patient, isPending, isError, error, refetch } = usePatient(id ?? '');
  const { data: doctors } = useDoctorOptions();
  const save = useSavePatient(id);
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (patient) form.reset(toFormValues(patient));
  }, [patient, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await save.mutateAsync({
        name: values.name,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        phone: values.phone,
        condition: values.condition,
        doctorId: values.doctorId,
      });
      toast.success(id ? 'Patient updated' : 'Patient created');
      router.push('/patients');
    } catch (error) {
      if (error instanceof ApiRequestError) {
        for (const issue of error.errors) {
          if (issue.field in values) {
            form.setError(issue.field as keyof PatientFormValues, { message: issue.message });
          }
        }
      }
      toast.error(error instanceof Error ? error.message : 'Could not save the patient');
    }
  });

  if (id && isPending) return <LoadingState label="Loading patient…" />;
  if (id && (isError || !patient)) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Could not load this patient'}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={id ? 'Edit patient' : 'Add patient'}
        description={id ? 'Update this patient record.' : 'Register a new patient and assign a doctor.'}
      />

      <form onSubmit={onSubmit} noValidate className="max-w-2xl rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={form.formState.errors.name?.message}>
            <input
              className={inputClass}
              placeholder="Alex Johnson"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register('name')}
            />
          </Field>
          <Field label="Date of birth" error={form.formState.errors.dateOfBirth?.message}>
            <input
              type="date"
              className={inputClass}
              aria-invalid={Boolean(form.formState.errors.dateOfBirth)}
              {...form.register('dateOfBirth')}
            />
          </Field>
          <Field label="Gender" error={form.formState.errors.gender?.message}>
            <select className={selectClass} {...form.register('gender')}>
              <option value="">Not specified</option>
              {GENDERS.map((item) => (
                <option key={item} value={item}>
                  {item[0]?.toUpperCase()}{item.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <input className={inputClass} placeholder="+1 555 1234567" {...form.register('phone')} />
          </Field>
          <Field label="Condition" error={form.formState.errors.condition?.message}>
            <select className={selectClass} {...form.register('condition')}>
              {PATIENT_CONDITIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Assigned doctor"
            error={form.formState.errors.doctorId?.message}
            hint={doctors?.length === 0 ? 'Add an active doctor first.' : undefined}
          >
            <select
              className={selectClass}
              aria-invalid={Boolean(form.formState.errors.doctorId)}
              {...form.register('doctorId')}
            >
              <option value="">Select a doctor</option>
              {doctors?.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} · {doctor.specialization}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            {id ? 'Save changes' : 'Create patient'}
          </Button>
          <Link href="/patients" className={buttonVariants({ variant: 'outline' })}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
