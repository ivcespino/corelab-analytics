import { SectionShell } from "./SectionShell";
import { Quote, BarChart3, MapPin, Activity } from "lucide-react";

/* New, reusable home-page section variants. None replace existing sections —
   they exist as additional templates that can be slotted into content.json. */

interface QuoteData {
  id: string; chapter: string; eyebrow: string; title: string;
  quote: string; attribution?: string;
}
export function QuoteHomeSection({ data, variant }: { data: QuoteData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="mx-auto max-w-3xl rounded-2xl border-l-4 border-l-accent bg-card/80 p-8 shadow-soft">
        <Quote className="h-10 w-10 text-accent/40" />
        <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">"{data.quote}"</p>
        {data.attribution && (
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            — {data.attribution}
          </p>
        )}
      </div>
    </SectionShell>
  );
}

interface KpiData {
  id: string; chapter: string; eyebrow: string; title: string;
  intro?: string;
  kpis: { value: string; label: string; sublabel?: string }[];
}
export function KpiSection({ data, variant }: { data: KpiData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.intro && <p className="max-w-2xl text-lg text-muted-foreground">{data.intro}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.kpis.map((k) => (
          <div key={k.label} className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-strong">
            <BarChart3 className="h-5 w-5 text-accent" />
            <p className="mt-3 font-display text-4xl font-bold text-primary dark:text-accent">{k.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{k.label}</p>
            {k.sublabel && <p className="mt-2 text-xs text-muted-foreground">{k.sublabel}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

interface TimelineData {
  id: string; chapter: string; eyebrow: string; title: string;
  steps: { phase: string; title: string; text: string }[];
}
export function TimelineHomeSection({ data, variant }: { data: TimelineData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <ol className="relative ml-3 space-y-6 border-l-2 border-accent/30 pl-6">
        {data.steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground shadow-soft">
              {i + 1}
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">{s.phase}</p>
            <p className="mt-1 font-display text-xl font-semibold">{s.title}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

interface ScopeData {
  id: string; chapter: string; eyebrow: string; title: string;
  inScope: string[]; outScope: string[];
}
export function ScopeSection({ data, variant }: { data: ScopeData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-6">
          <div className="flex items-center gap-2 text-accent">
            <MapPin className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-[0.18em]">In scope</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {data.inScope.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-accent">+</span>{s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Out of scope</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {data.outScope.map((s) => (
              <li key={s} className="flex gap-2 text-muted-foreground"><span>−</span>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
