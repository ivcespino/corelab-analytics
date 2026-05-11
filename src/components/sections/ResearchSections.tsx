import { SectionShell } from "./SectionShell";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import { scrollToHash } from "@/lib/scrollToHash";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Building2, FlaskConical, ArrowRight, BookOpen, FlaskRound } from "lucide-react";

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

/* ─────────────── H-4 Research Questions ─────────────── */
interface RQData {
  id: string; chapter: string; eyebrow: string; title: string;
  central: string;
  subs: string[];
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
    </SectionShell>
  );
}

/* ─────────────── H-4b Hypotheses ─────────────── */
interface HypothesesData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead?: string;
  hypotheses: { label: string; type: "alt" | "null"; text: string }[];
}
export function HypothesesSection({ data, variant }: { data: HypothesesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.lead && (
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{data.lead}</p>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {data.hypotheses.map((h) => {
          const isAlt = h.type === "alt";
          return (
            <div
              key={h.label}
              className={`relative overflow-hidden rounded-2xl border-2 p-7 shadow-soft sm:p-9 ${
                isAlt ? "border-accent bg-accent/5" : "border-border bg-card"
              }`}
            >
              <span className={`absolute right-5 top-3 font-display text-7xl font-bold leading-none ${isAlt ? "text-accent/15" : "text-muted-foreground/15"}`}>
                {isAlt ? "H₁" : "H₀"}
              </span>
              <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isAlt ? "text-accent" : "text-muted-foreground"}`}>
                {isAlt ? "Alternative" : "Null"}
              </p>
              <p className={`mt-2 font-display text-2xl font-bold ${isAlt ? "text-accent" : ""}`}>{h.label}</p>
              <p className="mt-4 text-base leading-relaxed text-foreground/90">{h.text}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Decision rule · Reject H₀ if combined regression p &lt; 0.05
      </p>
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
    const [path, hash] = href.split("#");
    navigate(hash ? `${path}#${hash}` : path);
  };

  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-5 lg:grid-cols-[5fr_7fr]">
        <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-5 shadow-soft sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">General Objective</p>
          <p className="mt-3 font-display text-base leading-snug sm:text-lg">{data.generalObjective}</p>
        </div>
        <div className="rounded-2xl border bg-card shadow-soft">
          <p className="border-b border-border px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Specific Objectives
          </p>
          <ol>
            {data.objectives.map((o, i) => (
              <li key={i}>
                <button
                  onClick={() => handleClick(o.href)}
                  className="group flex w-full items-center gap-3 border-b border-border/50 px-5 py-3 text-left text-sm leading-snug transition-colors last:border-0 hover:bg-accent/5"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground dark:bg-accent dark:text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="flex-1">{o.text}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
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

/* ─────────────── Chapter Divider (full-bleed) ─────────────── */
interface ChapterDividerData {
  id: string; chapter: string; eyebrow: string; title: string;
  number: string; lead?: string;
  toc?: { label: string; href?: string }[];
}
export function ChapterDividerSection({ data, variant }: { data: ChapterDividerData; variant: "odd" | "even" }) {
  return (
    <section
      id={data.id}
      data-toc={data.eyebrow}
      data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-10 sm:p-14 shadow-soft">
          <span className="absolute -right-10 -top-12 font-display text-[18rem] font-bold leading-none text-accent/10 select-none">
            {data.number}
          </span>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{data.chapter}</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">{data.title}</h2>
          {data.lead && <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80 sm:text-lg">{data.lead}</p>}
          {data.toc && (
            <ol
              className="mt-8 grid grid-flow-row gap-2 sm:grid-flow-col"
              style={{
                gridTemplateRows: `repeat(${Math.ceil(data.toc.length / 2)}, minmax(0, 1fr))`,
              }}
            >
              {data.toc.map((t, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border bg-card/60 px-4 py-2.5 backdrop-blur">
                  <span className="font-mono text-xs font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Single Literature/Theory Panel ─────────────── */
interface SinglePanelData {
  id: string; chapter: string; eyebrow: string; title: string;
  subtitle?: string;
  body: string;
  citation?: string;
  gap?: string;
  kind?: "literature" | "theory";
}
export function SinglePanelSection({ data, variant }: { data: SinglePanelData; variant: "odd" | "even" }) {
  const Icon = data.kind === "theory" ? FlaskRound : BookOpen;
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="hidden lg:block">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
            <Icon className="h-8 w-8" />
          </span>
        </div>
        <div className="rounded-2xl border bg-card p-7 shadow-soft sm:p-9">
          {data.subtitle && (
            <p className="font-display text-xl font-semibold text-accent sm:text-2xl">{data.subtitle}</p>
          )}
          {data.citation && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{data.citation}</p>
          )}
          <p className="mt-5 text-base leading-relaxed text-foreground/90 sm:text-lg">{data.body}</p>
          {data.gap && (
            <div className="mt-5 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Identified Gap</p>
              <p className="mt-1 text-sm leading-relaxed">{data.gap}</p>
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

/* ─────────────── Likert Items Table (for Intensity) ─────────────── */
interface LikertTableData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead?: string;
  items: { code: string; text: string; reverse: boolean }[];
  scale?: string;
}
export function LikertTableSection({ data, variant }: { data: LikertTableData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.lead && <p className="mb-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">{data.lead}</p>}
      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="border-b border-border px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Item</th>
              <th className="border-b border-border px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Behavioral Indicator</th>
              <th className="border-b border-border px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Coding</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((it) => (
              <tr key={it.code}>
                <td className="border-b border-border/50 px-4 py-3 font-mono text-xs">{it.code}</td>
                <td className="border-b border-border/50 px-4 py-3">{it.text}</td>
                <td className="border-b border-border/50 px-4 py-3 text-center">
                  {it.reverse ? (
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold text-accent">Reverse-coded</span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">Direct</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.scale && (
        <p className="mt-3 text-xs italic text-muted-foreground">{data.scale}</p>
      )}
    </SectionShell>
  );
}

/* ─────────────── Generic Table Slide (Chapter 2 tables) ─────────────── */
interface TableSlideData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead?: string;
  headers: string[];
  rows: (string | { v: string; em?: boolean })[][];
  note?: string;
  dense?: boolean;
}
export function TableSlideSection({ data, variant }: { data: TableSlideData; variant: "odd" | "even" }) {
  const cellPad = data.dense ? "px-3 py-1.5" : "px-4 py-3";
  const cellText = data.dense ? "text-[13px]" : "text-sm";
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.lead && <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{data.lead}</p>}
      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className={`w-full border-collapse ${cellText}`}>
          <thead>
            <tr className="bg-muted/50">
              {data.headers.map((h, i) => (
                <th key={i} className={`border-b border-border ${cellPad} text-left text-[11px] font-bold uppercase tracking-wider text-muted-foreground`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 1 ? "bg-muted/20" : ""}>
                {row.map((cell, ci) => {
                  const v = typeof cell === "string" ? cell : cell.v;
                  const em = typeof cell === "object" && cell.em;
                  return (
                    <td key={ci} className={`border-b border-border/40 ${cellPad} align-top ${em ? "font-semibold text-accent" : ""}`}>
                      {v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.note && <p className="mt-3 text-xs italic text-muted-foreground">{data.note}</p>}
    </SectionShell>
  );
}

/* ─────────────── References Section ─────────────── */
interface ReferencesData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead?: string;
  items: { author: string; year: string; title: string; href: string }[];
}
export function ReferencesSection({ data, variant }: { data: ReferencesData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.lead && <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{data.lead}</p>}
      <ol className="grid gap-2.5 sm:grid-cols-2">
        {data.items.map((it, i) => (
          <li key={i}>
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start gap-3 rounded-xl border bg-card p-3.5 shadow-soft transition-colors hover:border-accent hover:bg-accent/5"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground dark:bg-accent dark:text-accent-foreground">
                {i + 1}
              </span>
              <span className="flex-1 text-[13px] leading-snug">
                <span className="font-semibold">{it.author}</span>
                <span className="text-muted-foreground"> ({it.year}).</span>{" "}
                <span className="text-foreground/85">{it.title}</span>
                <ArrowRight className="ml-1 inline h-3 w-3 -translate-y-px text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

/* ─────────────── Sampling Funnel (Slovin) ─────────────── */
interface SamplingData {
  id: string; chapter: string; eyebrow: string; title: string;
  lead?: string;
  steps: { label: string; value: string; note?: string }[];
  formula?: { expr: string; caption: string };
}
export function SamplingFunnelSection({ data, variant }: { data: SamplingData; variant: "odd" | "even" }) {
  return (
    <SectionShell id={data.id} chapter={data.chapter} eyebrow={data.eyebrow} title={data.title} variant={variant}>
      {data.lead && <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{data.lead}</p>}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <ol className="space-y-2">
          {data.steps.map((s, i) => (
            <li key={i} className="flex items-stretch gap-3">
              <div className="grid w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground font-display text-base font-bold dark:bg-accent dark:text-accent-foreground">
                {i + 1}
              </div>
              <div className="flex-1 rounded-lg border bg-card p-3 shadow-soft">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-sm font-semibold">{s.label}</p>
                  <p className="font-mono text-base font-bold text-accent">{s.value}</p>
                </div>
                {s.note && <p className="mt-0.5 text-[11px] text-muted-foreground">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>
        {data.formula && (
          <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-5 shadow-soft">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">Slovin's Formula</p>
            <p className="mt-3 break-words text-center font-mono text-xl font-bold text-primary dark:text-accent">
              {data.formula.expr}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{data.formula.caption}</p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
