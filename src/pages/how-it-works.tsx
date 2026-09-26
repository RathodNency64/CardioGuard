import { ArrowRight, BarChart3, Check, Database, FileInput, GitBranch, ShieldAlert } from 'lucide-react';
import { Link } from 'wouter';
import { PageIntro, SectionLabel } from '@/components/site-shell';

const steps = [
  { n: '01', icon: FileInput, title: 'You provide the inputs', body: 'The form collects the 11 features expected by the project: age, gender, body measures, blood pressure, and five health indicators.', color: 'bg-primary/10 text-primary' },
  { n: '02', icon: Database, title: 'The API prepares them', body: 'The service validates the values and converts age from years into days, matching the format used by the notebook model.', color: 'bg-accent/60 text-accent-foreground' },
  { n: '03', icon: GitBranch, title: 'The trained model evaluates', body: 'The actual project model receives the feature vector and returns a class prediction plus its probability for that output.', color: 'bg-secondary text-secondary-foreground' },
  { n: '04', icon: BarChart3, title: 'You read it in context', body: 'CardioGuard shows the returned label and probability, then points you to the model, dataset, and recorded metrics.', color: 'bg-primary/10 text-primary' },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-8 lg:py-20">
      <PageIntro eyebrow="A transparent flow" title={<>From raw values<br /><span className="text-primary">to a readable signal.</span></>} description="A prediction is not a magic trick. Here is the precise journey your inputs take through CardioGuard — including the step where context matters most." />
      <div className="relative mt-16">
        <div className="absolute left-7 top-8 hidden h-[calc(100%-4rem)] w-px bg-border sm:block" />
        <div className="space-y-5">
          {steps.map(({ n, icon: Icon, title, body, color }, index) => (
            <article key={n} className={`rise-in delay-${index + 1} relative grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[72px_1fr_180px] sm:items-center sm:gap-8 sm:p-7`}>
              <div className={`relative z-10 flex size-14 items-center justify-center rounded-2xl ${color}`}><Icon size={23} /></div>
              <div><p className="font-mono-ui text-[10px] tracking-[.18em] text-muted-foreground">STEP {n}</p><h2 className="mt-2 font-display text-2xl tracking-tight">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{body}</p></div>
              <div className="hidden justify-self-end text-right sm:block"><span className="font-display text-5xl tracking-tight text-border">{n}</span><div className="mt-2 flex items-center justify-end gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">{index === 3 ? 'Read carefully' : 'Next'} {index < 3 && <ArrowRight size={12} />}</div></div>
            </article>
          ))}
        </div>
      </div>
      <section className="mt-20 grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-7 sm:p-9"><ShieldAlert size={23} className="text-primary" /><h2 className="mt-5 font-display text-3xl tracking-tight">Why the caveat is part of the interface</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">A model probability describes what the model learned from its dataset. It does not examine a person, account for every risk factor, or replace a conversation with a clinician. Being clear about that is not an asterisk; it is responsible model literacy.</p><Link href="/predict" data-testid="link-how-predict" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-extrabold text-primary-foreground">Try the flow <ArrowRight size={15} /></Link></div>
        <div className="rounded-[2rem] border border-border bg-card p-7 sm:p-9"><SectionLabel>What you can inspect</SectionLabel><ul className="space-y-5">{['The exact 11 input fields', 'The model and its feature list', 'Recorded notebook metrics', 'Whether project insights are available'].map((item) => <li key={item} className="flex items-start gap-3 text-sm font-semibold"><span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-secondary text-primary"><Check size={12} /></span>{item}</li>)}</ul></div>
      </section>
    </div>
  );
}
