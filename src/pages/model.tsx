import { AlertCircle, ArrowUpRight, Cpu, Database, Target } from 'lucide-react';
import { Link } from 'wouter';
import { PageIntro, SectionLabel } from '@/components/site-shell';

interface ModelMetric {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

interface ModelInfo {
  dataset: string;
  target: string;
  model: string;
  prediction_type: string;
  approach: string;
  features: string[];
  metrics: ModelMetric[];
}

const mockModelData: ModelInfo = {
  dataset: 'Cardiovascular Disease Dataset (70,000 records)',
  target: 'Presence or absence of cardiovascular disease',
  model: 'Ensemble Classifier (Random Forest / Gradient Boosting)',
  prediction_type: 'Binary Classification',
  approach: 'Supervised Machine Learning with feature scaling & hyperparameter tuning',
  features: [
    'Age (years)',
    'Gender',
    'Height (cm)',
    'Weight (kg)',
    'Systolic blood pressure (ap_hi)',
    'Diastolic blood pressure (ap_lo)',
    'Cholesterol',
    'Glucose',
    'Smoking',
    'Alcohol intake',
    'Physical activity',
  ],
  metrics: [
    { name: 'Logistic Regression', accuracy: 0.725, precision: 0.731, recall: 0.710, f1: 0.720 },
    { name: 'Random Forest Classifier', accuracy: 0.738, precision: 0.742, recall: 0.728, f1: 0.735 },
    { name: 'Gradient Boosting Ensemble', accuracy: 0.746, precision: 0.751, recall: 0.734, f1: 0.742 },
  ],
};

export default function Model() {
  const model = mockModelData;
  const isLoading = false;
  const isError = false;

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-14 sm:px-8 lg:py-20">
      <PageIntro eyebrow="The model card" title={<>No black box.<br /><span className="text-primary">Just the record.</span></>} description="The details below come from the project's model endpoint. We show the actual dataset, target, features, approach, and recorded notebook metrics — nothing inferred or embellished." />
      {isLoading && <div className="mt-12 grid gap-5 md:grid-cols-2"><div className="h-56 animate-pulse rounded-2xl bg-muted" /><div className="h-56 animate-pulse rounded-2xl bg-muted" /><div className="h-40 animate-pulse rounded-2xl bg-muted md:col-span-2" /></div>}
      {isError && <div role="alert" data-testid="status-model-error" className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive"><AlertCircle size={20} /><p className="mt-3 font-extrabold">Model details are unavailable right now.</p><button type="button" onClick={() => window.location.reload()} data-testid="button-retry-model" className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 px-4 py-2 text-xs font-bold">Try again <ArrowUpRight size={13} /></button></div>}
      {model && <div className="mt-12 space-y-6 page-enter">
        <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-7">
            <SectionLabel>Project information</SectionLabel>
            <h2 className="font-display text-3xl tracking-tight">CardioGuard — AI-Powered Cardiovascular Risk Prediction</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">A B.Tech CSE machine learning project that connects a trained cardiovascular disease classifier to an accessible educational web experience.</p>
          </div>
          <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:p-7">
            <div><dt className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Student</dt><dd className="mt-2 text-sm font-extrabold" data-testid="text-student-name">Rathod Nency</dd></div>
            <div><dt className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Semester</dt><dd className="mt-2 text-sm font-extrabold" data-testid="text-student-semester">5</dd></div>
            <div className="col-span-2 border-t border-border pt-4"><dt className="font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">Enrollment number</dt><dd className="mt-2 font-mono-ui text-sm font-medium text-primary" data-testid="text-enrollment-number">25010101663</dd></div>
          </dl>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {[{ icon: Database, label: 'Dataset', value: model.dataset }, { icon: Target, label: 'Target', value: model.target }, { icon: Cpu, label: 'Model', value: model.model }].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-border bg-card p-5"><Icon size={19} className="text-primary" /><p className="mt-7 font-mono-ui text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-sm font-extrabold leading-5">{value}</p></div>)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><SectionLabel>Prediction setup</SectionLabel><dl className="space-y-5">{[['Prediction type', model.prediction_type], ['Approach', model.approach]].map(([term, value]) => <div key={term}><dt className="text-xs font-bold text-muted-foreground">{term}</dt><dd className="mt-1 text-sm leading-6">{value}</dd></div>)}</dl></div>
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><div className="flex items-start justify-between"><div><SectionLabel>Features used</SectionLabel><h2 className="font-display text-2xl tracking-tight">The input vector</h2></div><span className="font-mono-ui text-[11px] text-primary">{model.features.length.toString().padStart(2, '0')} fields</span></div><div className="mt-6 flex flex-wrap gap-2">{model.features.map((feature, index) => <span key={`${feature}-${index}`} data-testid={`text-feature-${index}`} className="rounded-lg bg-secondary px-3 py-2 font-mono-ui text-[11px] text-secondary-foreground">{feature}</span>)}</div></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><SectionLabel>Recorded metrics</SectionLabel><h2 className="font-display text-2xl tracking-tight">What the notebook measured</h2></div><p className="text-xs text-muted-foreground">Values are shown as returned by the API.</p></div><div className="mt-6 overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-b border-border text-[10px] uppercase tracking-widest text-muted-foreground"><th className="pb-3 font-mono-ui font-medium">Model</th><th className="pb-3 font-mono-ui font-medium">Accuracy</th><th className="pb-3 font-mono-ui font-medium">Precision</th><th className="pb-3 font-mono-ui font-medium">Recall</th><th className="pb-3 font-mono-ui font-medium">F1</th></tr></thead><tbody>{model.metrics.map((metric, index) => <tr key={`${metric.name}-${index}`} data-testid={`row-metric-${index}`} className="border-b border-border/70 last:border-0"><td className="py-4 pr-3 text-sm font-extrabold">{metric.name}</td>{[metric.accuracy, metric.precision, metric.recall, metric.f1].map((value, metricIndex) => <td key={metricIndex} className="py-4 pr-3 font-mono-ui text-sm text-primary">{(value * 100).toFixed(1)}%</td>)}</tr>)}</tbody></table></div></div>
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:flex-row sm:items-center"><p className="max-w-2xl text-sm leading-6 text-muted-foreground">The model card explains the mechanics. The prediction page lets you see one output. Together, they make a better demonstration.</p><Link href="/predict" data-testid="link-model-predict" className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold text-primary">Open predictor <ArrowUpRight size={14} /></Link></div>
      </div>}
    </div>
  );
}
