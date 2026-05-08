import { SectionShell } from "./SectionShell";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import { scrollToHash } from "@/lib/scrollToHash";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Building2, FlaskConical, ArrowRight } from "lucide-react";

/* ─────────────── H-2 Background ─────────────── */
interface BackgroundTwoBeatData {
  id: string; chapter: string; eyebrow: string; title: string;
  beats: { label: string; body: string }[];
}
export function BackgroundTwoBeatSection({ data, variant }: { data: BackgroundTwoBeatData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-6 md:grid-cols-2">
        {data.beats.map((b, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl border bg-card p-7 shadow-soft">
            <span className="absolute right-4 top-3 font-display text-6xl font-bold text-muted-foreground/15">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{b.label}</p>
            <p className="mt-3 text-base leading-relaxed text-foreground/90 sm:text-lg">{b.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────────── H-3 Variables ─────────────── */
interface VariableCard {
  tag: string; title: string; definition: string; measurement: string;
  stats: { mean: string; sd: string; min: string; max: string };
  kind: "iv" | "dv";
}
interface VariablesData {
  id: string; chapter: string; eyebrow: string; title: string;
  cards: VariableCard[];
  context: string;
}
export function VariablesSection({ data, variant }: { data: VariablesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-4 md:grid-cols-3">
        {data.cards.map((c) => {
          const isDV = c.kind === "dv";
          return (
            <div
              key={c.title}
              className={`flex flex-col rounded-2xl border-2 p-6 shadow-soft transition-all hover:-translate-y-1 ${
                isDV ? "border-accent bg-accent/5" : "border-border bg-card"
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isDV ? "text-accent" : "text-muted-foreground"}`}>
                {c.tag}
              </span>
              <p className="mt-2 font-display text-2xl font-bold">{c.title}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{c.definition}</p>
              <p className="mt-3 text-[12px] leading-relaxed text-foreground/80">
                <span className="font-semibold">Measurement:</span> {c.measurement}
              </p>
              <div className="mt-auto grid grid-cols-4 gap-1 pt-4">
                {[
                  { k: "Mean", v: c.stats.mean },
                  { k: "SD", v: c.stats.sd },
                  { k: "Min", v: c.stats.min },
                  { k: "Max", v: c.stats.max },
                ].map((s) => (
                  <div key={s.k} className="rounded-lg border bg-background/50 p-2 text-center">
                    <p className="font-display text-sm font-bold text-primary dark:text-accent">{s.v}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{s.k}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-sm italic text-muted-foreground">{data.context}</p>
    </SectionShell>
  );
}

/* ─────────────── H-4 Research Questions + Hypotheses ─────────────── */
interface RQData {
  id: string; chapter: string; eyebrow: string; title: string;
  central: string;
  subs: string[];
  hypotheses: { label: string; type: "alt" | "null"; text: string }[];
}
export function ResearchQuestionsSection({ data, variant }: { data: RQData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="rounded-2xl border-l-4 border-l-accent bg-card p-6 shadow-soft sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Central Question</p>
        <p className="mt-3 font-display text-lg leading-snug sm:text-xl">{data.central}</p>
      </div>
      <ol className="mt-6 grid gap-3 md:grid-cols-3">
        {data.subs.map((q, i) => (
          <li key={i} className="flex gap-3 rounded-xl border bg-card p-4">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground dark:bg-accent dark:text-accent-foreground">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed">{q}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-4 border-t border-border pt-6 md:grid-cols-2">
        {data.hypotheses.map((h) => {
          const isAlt = h.type === "alt";
          return (
            <div key={h.label} className={`rounded-2xl border-2 p-5 ${isAlt ? "border-accent bg-accent/5" : "border-border bg-card"}`}>
              <p className={`font-display text-xl font-bold ${isAlt ? "text-accent" : "text-muted-foreground"}`}>{h.label}</p>
              <p className="mt-2 text-sm leading-relaxed">{h.text}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ─────────────── H-5 Significance ─────────────── */
interface SignificanceData {
  id: string; chapter: string; eyebrow: string; title: string;
  generalObjective: string;
  objectives: { text: string; href: string }[];
}
export function SignificanceSection({ data, variant }: { data: SignificanceData; variant: "odd" | "even" }) {
  const navigate = useNavigate();
  const handleClick = (href: string) => {
    if (href.startsWith("#")) {
      scrollToHash(href);
      return;
    }
    // route + hash
    const [path, hash] = href.split("#");
    navigate(hash ? `${path}#${hash}` : path);
  };

  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-6 shadow-soft sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">General Objective</p>
        <p className="mt-3 font-display text-lg leading-snug sm:text-xl">{data.generalObjective}</p>
      </div>
      <ol className="mt-6 space-y-2">
        {data.objectives.map((o, i) => (
          <li key={i}>
            <button
              onClick={() => handleClick(o.href)}
              className="group flex w-full items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:border-accent hover:shadow-soft"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground dark:bg-accent dark:text-accent-foreground">
                {i + 1}
              </span>
              <span className="flex-1 text-sm leading-relaxed">{o.text}</span>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
            </button>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

/* ─────────────── H-5b Beneficiaries ─────────────── */
const benIcons = [Users, GraduationCap, Building2, FlaskConical];
interface BeneficiariesData {
  id: string; chapter: string; eyebrow: string; title: string;
  cards: { title: string; body: string }[];
}
export function BeneficiariesSection({ data, variant }: { data: BeneficiariesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-4 sm:grid-cols-2">
        {data.cards.map((c, i) => {
          const Icon = benIcons[i % benIcons.length];
          return (
            <div key={c.title} className="group rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-accent">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110 dark:bg-accent dark:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold">{c.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

/* ─────────────── H-6 Literature carousel ─────────────── */
interface LiteratureData {
  id: string; chapter: string; eyebrow: string; title: string;
  panels: { heading: string; body: string; gap?: string }[];
}
export function LiteratureSection({ data, variant }: { data: LiteratureData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <SwipeCarousel
        ariaLabel="Review of related literature"
        panels={data.panels.map((p, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              {i === 0 ? "Synthesis" : `Theme ${i}`}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{p.heading}</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">{p.body}</p>
            {p.gap && (
              <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Gap</p>
                <p className="mt-1 text-sm leading-relaxed">{p.gap}</p>
              </div>
            )}
          </div>
        ))}
      />
    </SectionShell>
  );
}

/* ─────────────── H-7 Theoretical framework carousel ─────────────── */
interface FrameworkData {
  id: string; chapter: string; eyebrow: string; title: string;
  panels: { heading: string; body: string }[];
}
export function FrameworkSection({ data, variant }: { data: FrameworkData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <SwipeCarousel
        ariaLabel="Theoretical framework"
        panels={data.panels.map((p, i) => (
          <div key={i} className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              {i === 0 ? "Synthesis" : `Theory ${i}`}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{p.heading}</h3>
            <p className="mt-4 text-base leading-relaxed text-foreground/90">{p.body}</p>
          </div>
        ))}
      />
    </SectionShell>
  );
}

/* ─────────────── Methods (multi-block card grid) ─────────────── */
interface MethodsData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead: string;
  blocks: { heading: string; body: string }[];
}
export function MethodsSection({ data, variant }: { data: MethodsData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{data.lead}</p>
      <div className={`mt-6 grid gap-4 ${data.blocks.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {data.blocks.map((b, i) => (
          <div key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-display text-lg font-semibold">{b.heading}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{b.body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ─────────────── Methods Two-Column (in/out, criteria) ─────────────── */
interface MethodsTwoColData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead: string;
  leftLabel: string; leftItems: string[];
  rightLabel: string; rightItems: string[];
}
export function MethodsTwoColSection({ data, variant }: { data: MethodsTwoColData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{data.lead}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {[
          { label: data.leftLabel, items: data.leftItems, accent: false },
          { label: data.rightLabel, items: data.rightItems, accent: true },
        ].map((col) => (
          <div
            key={col.label}
            className={`rounded-2xl border-2 p-6 shadow-soft ${
              col.accent ? "border-accent/60 bg-accent/5" : "border-border bg-card"
            }`}
          >
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${col.accent ? "text-accent" : "text-muted-foreground"}`}>
              {col.label}
            </p>
            <ul className="mt-3 space-y-2.5">
              {col.items.map((it, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${col.accent ? "bg-accent" : "bg-primary dark:bg-accent"}`} />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
