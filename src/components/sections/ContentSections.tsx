import { SectionShell } from "./SectionShell";
import { Computer, TrendingUp, Users, Wrench, Clock, BarChart3, LineChart, HelpCircle, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  computer: Computer,
  trending_up: TrendingUp,
  groups: Users,
  build: Wrench,
  schedule: Clock,
  insights: BarChart3,
  analytics: LineChart,
  default: Sparkles,
};

interface BackgroundData {
  id: string; chapter: string; eyebrow: string; title: string;
  paragraphs: string[];
  highlights: { icon: string; title: string; text: string }[];
}

export function BackgroundSection({ data, variant }: { data: BackgroundData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
          {data.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="grid gap-3">
          {data.highlights.map((h) => {
            const Icon = iconMap[h.icon] ?? iconMap.default;
            return (
              <div key={h.title} className="glass-card flex items-start gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display font-semibold">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

interface ProblemData {
  id: string; chapter: string; eyebrow: string; title: string;
  centralQuestion: string;
  subQuestions: string[];
}

export function ProblemSection({ data, variant }: { data: ProblemData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass-card relative overflow-hidden border-l-4 border-l-accent p-8">
          <HelpCircle className="absolute -right-4 -top-4 h-32 w-32 text-accent/10" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Central Question</p>
          <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">
            {data.centralQuestion}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Sub-questions
          </p>
          <ol className="space-y-3">
            {data.subQuestions.map((q, i) => (
              <li key={i} className="flex gap-3 rounded-xl border bg-card p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionShell>
  );
}

interface ObjectivesData {
  id: string; chapter: string; eyebrow: string; title: string;
  items: { icon: string; title: string; text: string }[];
}

export function ObjectivesSection({ data, variant }: { data: ObjectivesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.items.map((it, i) => {
          const Icon = iconMap[it.icon] ?? iconMap.default;
          return (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:border-accent hover:shadow-soft"
            >
              <span className="absolute right-4 top-4 font-display text-5xl font-bold text-muted/40">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold">{it.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{it.text}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

interface HypothesesData {
  id: string; chapter: string; eyebrow: string; title: string;
  items: { label: string; type: "null" | "alt"; text: string }[];
}

export function HypothesesSection({ data, variant }: { data: HypothesesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-5 lg:grid-cols-2">
        {data.items.map((h) => {
          const isAlt = h.type === "alt";
          return (
            <div
              key={h.label}
              className={`relative overflow-hidden rounded-2xl border-2 p-8 ${
                isAlt
                  ? "border-accent bg-accent/5"
                  : "border-border bg-card"
              }`}
            >
              <p className={`font-display text-7xl font-bold ${isAlt ? "text-accent" : "text-muted-foreground/40"}`}>
                {h.label}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {isAlt ? "Alternative Hypothesis" : "Null Hypothesis"}
              </p>
              <p className="mt-4 text-base leading-relaxed">{h.text}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
