import { Activity, ArrowRight, BookOpen, CheckCircle2, Database, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useHealthCheck, getHealthCheckQueryKey } from '@workspace/api-client-react';
import { SectionLabel } from '@/components/site-shell';

export default function Home() {
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey(), staleTime: 30_000 } });
  const serverReady = health.data?.status === 'ok' || health.data?.status === 'healthy';
  return (
    <div className="page-enter">
      <section className="mx-auto grid w-full max-w-[1240px] gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28">
        <div className="relative">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-primary">
            <span className="size-1.5 rounded-full bg-primary pulse-line" />
            {health.isPending ? 'Connecting to model service' : serverReady ? 'Model service ready' : 'Educational model companion'}
          </div>
          <h1 className="max-w-2xl font-display text-[clamp(3.5rem,8vw,7.5rem)] leading-[.88] tracking-[-0.065em] text-foreground">
            Risk, made<br /><span className="text-primary">readable.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
            CardioGuard turns an 11-input cardiovascular risk model into a clear, grounded learning moment — not a diagnosis, and never a substitute for care.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link href="/predict" data-testid="link-start-prediction" className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-extrabold text-primary-foreground shadow-[0_14px_28px_hsl(167_48%_38%/.18)] transition-all hover:-translate-y-1">
              Explore a prediction <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/how-it-works" data-testid="link-learn-flow" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-bold text-foreground hover:text-primary">
              See the flow <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-border/80 pt-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> Evidence-aware by design</span>
            <span className="inline-flex items-center gap-2"><BookOpen size={14} className="text-primary" /> Built for college demos</span>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
          <div className="soft-grid absolute -inset-8 rounded-[2.5rem] opacity-50" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-[0_24px_70px_hsl(204_39%_20%/.12)] sm:p-7">
            <div className="flex items-start justify-between">
              <div><p className="font-mono-ui text-[10px] uppercase tracking-[.16em] text-muted-foreground">Prediction workspace</p><p className="mt-2 text-lg font-extrabold tracking-tight">A transparent starting point</p></div>
              <div className="rounded-xl bg-accent/60 p-2.5 text-accent-foreground"><Activity size={20} /></div>
            </div>
            <div className="my-7 rounded-2xl bg-secondary/60 p-5">
              <div className="flex items-end justify-between"><div><p className="text-xs font-semibold text-muted-foreground">Model signal</p><p className="mt-1 font-mono-ui text-4xl font-medium tracking-tight text-primary">72.8<span className="text-xl">%</span></p></div><span className="rounded-full bg-primary/10 px-2 py-1 font-mono-ui text-[10px] text-primary">illustrative</span></div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-background"><div className="h-full w-[72.8%] rounded-full bg-primary" /></div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">A probability from the selected model — best read alongside its features and limitations.</p>
            </div>
            <div className="space-y-3">
              {['11 input features', 'A recorded model + dataset', 'Plain-language context'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border/80 px-3.5 py-3 text-sm font-semibold"><CheckCircle2 size={16} className={index === 1 ? 'text-accent-foreground' : 'text-primary'} /><span>{item}</span><span className="ml-auto font-mono-ui text-[10px] text-muted-foreground">0{index + 1}</span></div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 text-[11px] text-muted-foreground"><Sparkles size={13} className="text-primary" /> No clinical claims. Just useful context.</div>
          </div>
        </div>
      </section>
      <section className="border-y border-border/70 bg-card/55">
        <div className="mx-auto grid w-full max-w-[1240px] gap-0 px-5 sm:grid-cols-3 sm:px-8 lg:px-10">
          {[
            { icon: Database, title: 'See the inputs', copy: 'Explore exactly what the model receives, from age to activity.' },
            { icon: Activity, title: 'Read the output', copy: 'A probability and label, presented with the right amount of caution.' },
            { icon: ShieldCheck, title: 'Keep perspective', copy: 'Learn what a dataset can show — and what it cannot.' },
          ].map(({ icon: Icon, title, copy }, i) => <div key={title} className={`flex gap-4 py-8 sm:px-7 ${i > 0 ? 'border-t border-border/70 sm:border-l sm:border-t-0' : ''}`}><Icon size={21} className="mt-1 shrink-0 text-primary" /><div><h2 className="font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div></div>)}
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-28">
        <div className="max-w-2xl"><SectionLabel>A measured lens</SectionLabel><h2 className="font-display text-4xl leading-tight tracking-[-.04em] sm:text-5xl">Understanding the prediction is part of the prediction.</h2></div>
        <Link href="/model" data-testid="link-explore-model" className="group inline-flex shrink-0 items-center gap-2 text-sm font-extrabold text-primary">Explore model details <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
      </section>
    </div>
  );
}
