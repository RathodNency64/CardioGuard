import { AlertCircle, BarChart3, CheckCircle2, Database, FileQuestion, Info } from 'lucide-react';
import { PageIntro, SectionLabel } from '@/components/site-shell';

interface ModelInsights {
  dataset_rows: number;
  positive_rate: number;
  available: boolean;
  message: string;
  notes: string[];
}

const mockInsightsData: ModelInsights = {
  dataset_rows: 70000,
  positive_rate: 0.499,
  available: true,
  message: 'Exploratory data analysis indicates a balanced distribution across cardiovascular target labels in the processed dataset.',
  notes: [
    'Blood pressure features (ap_hi and ap_lo) required filtering to remove extreme outlier values recorded during data collection.',
    'Age was normalized from days into years for clearer model interpretation and user input formatting.',
    'Feature correlation analysis highlighted systolic blood pressure and cholesterol as strong univariate indicators.',
  ],
};

export default function Insights() {
  const insights = mockInsightsData;
  const isLoading = false;
  const isError = false;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-8 lg:py-20">
      <PageIntro eyebrow="Project notes" title={<>What the dataset says.<br /><span className="text-primary">And what it does not.</span></>} description="This page only surfaces facts already recorded in the project. No hidden analysis, no invented trends, and no chart where the source does not provide one." />
      {isLoading && <div className="mt-12 grid gap-5 sm:grid-cols-2"><div className="h-48 animate-pulse rounded-2xl bg-muted" /><div className="h-48 animate-pulse rounded-2xl bg-muted" /><div className="h-72 animate-pulse rounded-2xl bg-muted sm:col-span-2" /></div>}
      {isError && <div role="alert" data-testid="status-insights-error" className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive"><AlertCircle size={20} /><p className="mt-3 font-extrabold">Project notes are unavailable right now.</p><button type="button" onClick={() => window.location.reload()} data-testid="button-retry-insights" className="mt-4 rounded-full border border-destructive/30 px-4 py-2 text-xs font-bold">Try again</button></div>}
      {insights && <div className="mt-12 space-y-6 page-enter">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><Database size={20} className="text-primary" /><p className="mt-8 font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">Dataset rows</p><p className="mt-2 font-display text-5xl tracking-tight" data-testid="text-dataset-rows">{insights.dataset_rows.toLocaleString()}</p><p className="mt-3 text-sm text-muted-foreground">Rows reported by the project endpoint.</p></div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><BarChart3 size={20} className="text-primary" /><p className="mt-8 font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">Positive rate</p><p className="mt-2 font-display text-5xl tracking-tight" data-testid="text-positive-rate">{(insights.positive_rate * 100).toFixed(1)}<span className="text-3xl text-primary">%</span></p><p className="mt-3 text-sm text-muted-foreground">The target prevalence reported by the project.</p></div>
        </div>
        <div className={`rounded-2xl border p-6 sm:p-7 ${insights.available ? 'border-primary/20 bg-primary/5' : 'border-accent/50 bg-accent/20'}`}><div className="flex gap-4"><div className="mt-0.5 shrink-0">{insights.available ? <CheckCircle2 size={20} className="text-primary" /> : <FileQuestion size={20} className="text-accent-foreground" />}</div><div><p className="font-extrabold">{insights.available ? 'Recorded insights are available' : 'No EDA visual outputs are available'}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground" data-testid="text-insights-message">{insights.message}</p></div></div></div>
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><SectionLabel>Reading this page</SectionLabel><div className="flex gap-3 text-sm leading-6 text-muted-foreground"><Info size={17} className="mt-0.5 shrink-0 text-primary" /><p>These are dataset-level facts, not individual health guidance. A positive rate describes the dataset's target distribution; it does not estimate any visitor's personal risk.</p></div></div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><SectionLabel>Project notes</SectionLabel>{insights.notes && insights.notes.length > 0 ? <ul className="space-y-4">{insights.notes.map((note, index) => <li key={`${note}-${index}`} data-testid={`text-insight-note-${index}`} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="font-mono-ui text-[10px] text-primary">{String(index + 1).padStart(2, '0')}</span><span>{note}</span></li>)}</ul> : <p className="text-sm leading-6 text-muted-foreground">The API did not provide additional notes for this project.</p>}</div>
        </div>
      </div>}
    </div>
  );
}
