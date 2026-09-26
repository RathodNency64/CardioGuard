import { ArrowLeft, CircleOff } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-[720px] flex-col items-start justify-center px-5 py-20 sm:px-8">
      <CircleOff size={30} className="text-primary" />
      <p className="mt-8 font-mono-ui text-[10px] uppercase tracking-[.2em] text-primary">Signal not found · 404</p>
      <h1 className="mt-3 font-display text-5xl tracking-[-.05em] sm:text-6xl">This page is outside the model.</h1>
      <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">The route you requested does not exist in this demonstration. The useful parts of CardioGuard are still close by.</p>
      <Link href="/" data-testid="link-not-found-home" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-extrabold text-primary-foreground"><ArrowLeft size={15} /> Return to overview</Link>
    </div>
  );
}
