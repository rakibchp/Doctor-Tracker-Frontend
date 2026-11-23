'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { HeartPulse, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Field, inputClass } from '@/components/ui/common';

const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('expired') === '1';
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [isLoading, user, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      toast.success('Welcome back');
      router.replace('/dashboard');
    } catch (error) {
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Could not log in',
      });
    }
  });

  return (
    <main className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-2">
        <div className="bg-primary text-primary-foreground hidden flex-col justify-between p-10 md:flex">
          <div className="flex items-center gap-2">
            <span className="bg-primary-foreground/15 flex size-9 items-center justify-center rounded-lg">
              <HeartPulse className="size-5" />
            </span>
            <span className="font-semibold">Doctor Tracker</span>
          </div>
          <div>
            <h1 className="text-3xl leading-tight font-semibold">
              Your clinic, at a glance.
            </h1>
            <p className="text-primary-foreground/80 mt-3 text-sm">
              Keep track of doctors, patient registrations and activity from one secure dashboard.
            </p>
          </div>
          <p className="text-primary-foreground/60 text-xs">Authorized staff only</p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Enter your admin credentials to continue.
            </p>
          </div>

          {sessionExpired ? (
            <p role="alert" className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
              Your session expired. Please sign in again.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <Field label="Email address" error={form.formState.errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                className={inputClass}
                aria-invalid={Boolean(form.formState.errors.email)}
                {...form.register('email')}
              />
            </Field>
            <Field label="Password" error={form.formState.errors.password?.message}>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
                aria-invalid={Boolean(form.formState.errors.password)}
                {...form.register('password')}
              />
            </Field>

            {form.formState.errors.root?.message ? (
              <p role="alert" className="text-destructive rounded-lg bg-destructive/10 px-3 py-2 text-sm">
                {form.formState.errors.root.message}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isLoading}>
              {form.formState.isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </form>

          <p className="text-muted-foreground mt-8 text-center text-xs">
            Need access? Ask your clinic administrator for an account.{' '}
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
