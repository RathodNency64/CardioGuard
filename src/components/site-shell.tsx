import { useState, type ReactNode } from 'react';
import { Activity, ArrowUpRight, HeartPulse, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/predict', label: 'Try a prediction' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/model', label: 'The model' },
  { href: '/insights', label: 'Project notes' },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" data-testid="link-logo">
      <span className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_20px_hsl(167_48%_38%/.2)]">
        <HeartPulse size={19} strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-accent ring-2 ring-background" />
      </span>
      {!compact && (
        <span className="text-[15px] font-extrabold tracking-[-0.04em] text-foreground">
          Cardio<span className="text-primary">Guard</span>
        </span>
      )}
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <div className="site-shell flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                className={cn(
                  'rounded-lg px-3 py-2 text-[12px] font-bold tracking-[0.01em] transition-colors',
                  location === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/predict"
            data-testid="link-header-predict"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-[12px] font-extrabold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Open predictor <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card md:hidden"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            onClick={() => setOpen((value) => !value)}
            data-testid="button-mobile-menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border/70 bg-background px-5 pb-5 pt-3 md:hidden">
            <nav className="mx-auto flex max-w-[1240px] flex-col gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                  className={cn('rounded-lg px-3 py-3 text-sm font-bold', location === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border/70 bg-card/50">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-5 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><Activity size={14} className="text-primary" /><span>CardioGuard · a teaching companion for model literacy</span><span className="text-border">|</span><span>Developed by Rathod Nency</span></div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.14em]">Not medical advice · For demonstration use</p>
        </div>
      </footer>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-4 font-mono-ui text-[10px] font-medium uppercase tracking-[0.2em] text-primary">{children}</p>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: string }) {
  return (
    <div className="max-w-3xl page-enter">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h1 className="text-balance font-display text-5xl leading-[.98] tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}
