import { useState, type ReactNode } from 'react';
import { AlertCircle, ArrowRight, Check, ChevronLeft, Info, RotateCcw, ShieldCheck } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { PredictionInput, PredictionResult } from '@workspace/api-client-react';
import { usePredictCardiovascularRisk } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageIntro, SectionLabel } from '@/components/site-shell';
import { cn } from '@/lib/utils';

const predictionSchema = z.object({
  age: z.coerce.number().int('Use a whole number of years').min(18, 'This demonstration model starts at age 18').max(120, 'Please enter an age under 120'),
  gender: z.coerce.number().refine((value) => value === 1 || value === 2, 'Choose a gender code'),
  height: z.coerce.number().positive('Enter a height above zero').max(250, 'Please check the height'),
  weight: z.coerce.number().positive('Enter a weight above zero').max(400, 'Please check the weight'),
  ap_hi: z.coerce.number().int().min(80, 'Systolic pressure must be at least 80').max(250, 'Please check the systolic value'),
  ap_lo: z.coerce.number().int().min(40, 'Diastolic pressure must be at least 40').max(150, 'Please check the diastolic value'),
  cholesterol: z.coerce.number().refine((value) => [1, 2, 3].includes(value), 'Choose a cholesterol category'),
  gluc: z.coerce.number().refine((value) => [1, 2, 3].includes(value), 'Choose a glucose category'),
  smoke: z.coerce.number().refine((value) => [0, 1].includes(value), 'Choose an option'),
  alco: z.coerce.number().refine((value) => [0, 1].includes(value), 'Choose an option'),
  active: z.coerce.number().refine((value) => [0, 1].includes(value), 'Choose an option'),
});

type PredictionForm = z.infer<typeof predictionSchema>;

const defaults: PredictionForm = { age: 36, gender: 1, height: 170, weight: 70, ap_hi: 120, ap_lo: 80, cholesterol: 1, gluc: 1, smoke: 0, alco: 0, active: 1 };

function FieldBlock({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-2xl border border-border bg-card p-4 sm:p-5', className)}>{children}</div>;
}

function SelectField({ control, name, label, description, options }: { control: ReturnType<typeof useForm<PredictionForm>>['control']; name: keyof PredictionForm; label: string; description: string; options: { value: number; label: string }[] }) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-extrabold">{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
        <FormControl>
          <select {...field} value={String(field.value)} onChange={(event) => field.onChange(Number(event.target.value))} className="mt-1 flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-semibold outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15" data-testid={`select-${name}`}>
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function NumberField({ control, name, label, description, min, max, suffix }: { control: ReturnType<typeof useForm<PredictionForm>>['control']; name: keyof PredictionForm; label: string; description: string; min?: number; max?: number; suffix: string }) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-extrabold">{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
        <div className="relative mt-1">
          <FormControl><Input {...field} type="number" min={min} max={max} step="1" className="h-11 rounded-xl bg-background pr-16 font-semibold" data-testid={`input-${name}`} /></FormControl>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">{suffix}</span>
        </div>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function BinaryField({ control, name, label, description }: { control: ReturnType<typeof useForm<PredictionForm>>['control']; name: keyof PredictionForm; label: string; description: string }) {
  return (
    <FormField control={control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-extrabold">{label}</FormLabel>
        <FormDescription>{description}</FormDescription>
        <FormControl>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[{ value: 1, label: 'Yes' }, { value: 0, label: 'No' }].map((option) => (
              <button type="button" key={option.value} onClick={() => field.onChange(option.value)} data-testid={`button-${name}-${option.label.toLowerCase()}`} className={cn('rounded-xl border px-3 py-2.5 text-sm font-extrabold transition-all', Number(field.value) === option.value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40')}>
                {Number(field.value) === option.value && <Check size={14} className="mr-1.5 inline" />}{option.label}
              </button>
            ))}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );
}

function ResultCard({ result, onReset }: { result: PredictionResult; onReset: () => void }) {
  const percent = Math.round(result.probability * 1000) / 10;
  const circumference = 2 * Math.PI * 54;
  return (
    <div className="page-enter rounded-[2rem] border border-primary/20 bg-card p-6 shadow-[0_20px_60px_hsl(167_48%_38%/.1)] sm:p-9">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
        <div className="relative mx-auto size-44 shrink-0 sm:mx-0">
          <svg viewBox="0 0 128 128" className="size-full ring-meter" aria-label={`${percent}% probability`}>
            <circle cx="64" cy="64" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="9" />
            <circle cx="64" cy="64" r="54" fill="none" stroke="hsl(var(--primary))" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - result.probability)} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="font-mono-ui text-3xl font-medium tracking-tight text-primary">{percent}%</span><span className="text-[10px] uppercase tracking-widest text-muted-foreground">model signal</span></div>
        </div>
        <div className="flex-1">
          <SectionLabel>Prediction returned</SectionLabel>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{result.prediction_label}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">This output came from <span className="font-semibold text-foreground">{result.model_name}</span> using the 11 values you entered. It is a model probability, not a personal diagnosis or medical assessment.</p>
          <div className="mt-5 flex flex-wrap gap-3"><span className="rounded-full bg-primary/10 px-3 py-1.5 font-mono-ui text-[10px] uppercase tracking-wider text-primary">Class {result.prediction}</span><span className="rounded-full bg-secondary px-3 py-1.5 font-mono-ui text-[10px] uppercase tracking-wider text-secondary-foreground">Probability {percent}%</span></div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex max-w-lg gap-2 text-xs leading-5 text-muted-foreground"><Info size={15} className="mt-0.5 shrink-0 text-primary" /> Educational use only. Do not use this result to make health decisions. Speak with a qualified clinician for personal guidance.</p>
        <button type="button" onClick={onReset} data-testid="button-new-prediction" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-extrabold text-foreground transition-colors hover:border-primary hover:text-primary"><RotateCcw size={14} /> Start over</button>
      </div>
    </div>
  );
}

export default function Predict() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const form = useForm<PredictionForm>({ resolver: zodResolver(predictionSchema), defaultValues: defaults, mode: 'onBlur' });
  const predict = usePredictCardiovascularRisk();
  const submit = (values: PredictionForm) => {
    const payload = values as PredictionInput;
    predict.mutate({ data: payload }, { onSuccess: (data) => { setResult(data); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  };
  if (result) return <div className="mx-auto w-full max-w-[980px] px-5 py-14 sm:px-8 lg:py-20"><button type="button" onClick={() => setResult(null)} data-testid="button-back-to-form" className="mb-8 inline-flex items-center gap-2 text-xs font-extrabold text-muted-foreground hover:text-primary"><ChevronLeft size={15} /> Back to inputs</button><ResultCard result={result} onReset={() => { setResult(null); form.reset(defaults); }} /></div>;
  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-8 lg:py-20">
      <PageIntro eyebrow="The prediction workspace" title={<>A small set of inputs.<br /><span className="text-primary">A useful conversation.</span></>} description="Enter the same 11 features used by the project model. CardioGuard will return the model's label and probability, with enough context to understand what that output means." />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_300px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-5" noValidate>
            <FieldBlock><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl tracking-tight">Basic measures</h2><p className="mt-1 text-xs text-muted-foreground">Use the units shown. Age is entered in years.</p></div><span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">01 / 03</span></div><div className="grid gap-5 sm:grid-cols-2"><NumberField control={form.control} name="age" label="Age" description="Age at time of observation" min={18} max={120} suffix="years" /><SelectField control={form.control} name="gender" label="Gender code" description="Notebook encoding: 1 or 2" options={[{ value: 1, label: 'Code 1' }, { value: 2, label: 'Code 2' }]} /><NumberField control={form.control} name="height" label="Height" description="Standing height" min={1} max={250} suffix="cm" /><NumberField control={form.control} name="weight" label="Weight" description="Body weight" min={1} max={400} suffix="kg" /></div></FieldBlock>
            <FieldBlock><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl tracking-tight">Blood pressure</h2><p className="mt-1 text-xs text-muted-foreground">Record the systolic and diastolic values as whole numbers.</p></div><span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">02 / 03</span></div><div className="grid gap-5 sm:grid-cols-2"><NumberField control={form.control} name="ap_hi" label="Systolic pressure" description="The upper number" min={80} max={250} suffix="mmHg" /><NumberField control={form.control} name="ap_lo" label="Diastolic pressure" description="The lower number" min={40} max={150} suffix="mmHg" /></div></FieldBlock>
            <FieldBlock><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="font-display text-2xl tracking-tight">Health indicators</h2><p className="mt-1 text-xs text-muted-foreground">Categories use the project notebook's numeric encoding.</p></div><span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">03 / 03</span></div><div className="grid gap-5 sm:grid-cols-2"><SelectField control={form.control} name="cholesterol" label="Cholesterol" description="1 normal · 2 above normal · 3 well above" options={[{ value: 1, label: '1 — Normal' }, { value: 2, label: '2 — Above normal' }, { value: 3, label: '3 — Well above normal' }]} /><SelectField control={form.control} name="gluc" label="Glucose" description="1 normal · 2 above normal · 3 well above" options={[{ value: 1, label: '1 — Normal' }, { value: 2, label: '2 — Above normal' }, { value: 3, label: '3 — Well above normal' }]} /><BinaryField control={form.control} name="smoke" label="Smoking" description="Current smoking indicator" /><BinaryField control={form.control} name="alco" label="Alcohol intake" description="Alcohol intake indicator" /><BinaryField control={form.control} name="active" label="Physical activity" description="Active lifestyle indicator" /></div></FieldBlock>
            {predict.isError && <div role="alert" data-testid="status-prediction-error" className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertCircle size={18} className="mt-0.5 shrink-0" /><div><p className="font-extrabold">The model could not return a prediction.</p><p className="mt-1 text-xs leading-5 opacity-80">Check your entries and try again. If the problem continues, the model service may be unavailable.</p></div></div>}
            <button type="submit" disabled={predict.isPending} data-testid="button-submit-prediction" className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-primary px-6 text-sm font-extrabold text-primary-foreground shadow-[0_14px_28px_hsl(167_48%_38%/.15)] transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">{predict.isPending ? <><span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" /> Running the model…</> : <>Return a model signal <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></>}</button>
          </form>
        </Form>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start"><div className="rounded-2xl border border-primary/20 bg-primary/5 p-5"><ShieldCheck size={20} className="text-primary" /><h2 className="mt-4 font-extrabold">A careful read</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">The backend converts age from years into the notebook's day-based format. All other values are sent as entered.</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Before you begin</p><ul className="mt-4 space-y-3 text-xs leading-5 text-muted-foreground"><li className="flex gap-2"><span className="text-primary">01</span> This is a classroom demonstration.</li><li className="flex gap-2"><span className="text-primary">02</span> The output is not a medical opinion.</li><li className="flex gap-2"><span className="text-primary">03</span> Explore the model context after.</li></ul></div><Link href="/model" data-testid="link-predict-model-details" className="block rounded-2xl border border-border bg-card p-5 text-xs font-extrabold transition-colors hover:border-primary hover:text-primary">Read the model notes <span className="float-right text-lg">↗</span></Link></aside>
      </div>
    </div>
  );
}
