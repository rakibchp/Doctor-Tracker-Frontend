'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from './auth-provider';
import { Button } from './ui/button';

const NAVIGATION = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/patients', label: 'Patients', icon: Users },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not log out');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <aside className="border-border bg-card lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </span>
          <div>
            <p className="text-sm leading-tight font-semibold">Doctor Tracker</p>
            <p className="text-muted-foreground text-xs">Clinic administration</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {NAVIGATION.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={
                  active
                    ? 'bg-primary text-primary-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                }
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden border-t border-border p-3 lg:block">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
              {user?.name.slice(0, 2).toUpperCase() ?? 'DT'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="text-muted-foreground truncate text-xs">{user?.email}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-card flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Activity className="text-primary size-5" />
            <span className="font-semibold">Doctor Tracker</span>
          </div>
          <p className="text-muted-foreground hidden text-sm lg:block">
            Manage doctors, patients and clinic activity in one place.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
