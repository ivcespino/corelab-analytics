import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { TocDropdown, type TocItem } from "@/components/TocDropdown";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { PlotlyChart } from "@/components/tool/PlotlyChart";
import { BarChart3, Activity, Quote as QuoteIcon, CheckCircle2, ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface DashboardData {
  intro: { chapter: string; eyebrow: string; title: string; description: string };
  sections: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeId, setActiveId] = useState("intro");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/dashboard.json").then((r) => r.json()).then(setData).catch(console.error);
  }, []);

  const tocItems: TocItem[] = useMemo(() => {
    if (!data) return [];
    return [
      { id: "intro", label: data.intro.eyebrow, chapter: data.intro.chapter },
      ...data.sections.map((s) => ({ id: s.id, label: s.eyebrow, chapter: s.chapter })),
      { id: "finale", label: "Continue", chapter: "Continue" },
    ];
  }, [data]);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const root = containerRef.current;
    const sections = root.querySelectorAll<HTMLElement>(".snap-section");
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [data]);

  const jumpTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div ref={containerRef} className="snap-container">
        <IntroSection data={data.intro} />
        {data.sections.map((s, i) => {
          // Intro is "even"; alternate from there so neighbors never repeat.
          const variant = i % 2 === 0 ? "odd" : "even";
          switch (s.template) {
            case "stat":     return <StatSection key={s.id} data={s} variant={variant} />;
            case "split":    return <SplitSection key={s.id} data={s} variant={variant} />;
            case "feature":  return <FeatureSection key={s.id} data={s} variant={variant} />;
            case "quote":    return <QuoteSection key={s.id} data={s} variant={variant} />;
            case "timeline": return <TimelineSection key={s.id} data={s} variant={variant} />;
            default:         return null;
          }
        })}
        <FinaleSection
          data={{
            eyebrow: "Continue",
            title: "Want the raw numbers?",
            description: "Run your own analysis with the tool, or revisit the research framing on the home page.",
            links: [
              { label: "Open the Tool", href: "/tool", icon: "science" },
              { label: "Back to Home", href: "/", icon: "home" },
              { label: "Meet the Team", href: "/team", icon: "groups" },
            ],
            footer: "© 2025 CoreLab Analytics — ITMAWD 12A research group · STI College Malolos",
          }}
          onBackToTop={() => jumpTo("intro")}
        />
      </div>
      <TocDropdown items={tocItems} activeId={activeId} onJump={jumpTo} />
    </>
  );
}

/* ─────────────── Section templates (each easy to duplicate) ─────────────── */

function ChapterChip({ chapter, eyebrow }: { chapter: string; eyebrow: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary dark:bg-accent/15 dark:text-accent">
        {chapter}
      </span>
      <span className="section-eyebrow">{eyebrow}</span>
    </div>
  );
}

function IntroSection({ data }: { data: DashboardData["intro"] }) {
  // Sample plot — placeholder until tool data wires through.
  const plot = useMemo(() => {
    const x = Array.from({ length: 30 }, (_, i) => i + 1);
    const y = x.map((v) => 60 + v * 1.2 + (Math.random() - 0.5) * 8);
    return {
      data: [
        { type: "scatter", mode: "markers", x, y, name: "Observations",
          marker: { color: "hsl(188, 100%, 42%)", size: 8 } },
        { type: "scatter", mode: "lines", x: [x[0], x[x.length - 1]],
          y: [60 + x[0] * 1.2, 60 + x[x.length - 1] * 1.2],
          line: { color: "hsl(231, 65%, 30%)", width: 2 }, name: "Trend" },
      ] as Plotly.Data[],
      layout: { xaxis: { title: { text: "Lab hours / week" } }, yaxis: { title: { text: "Performance Δ" } } },
    };
  }, []);

  const bar = useMemo(() => ({
    data: [{
      type: "bar",
      x: ["Item 1", "Item 2", "Item 3", "Item 4"],
      y: [4.1, 3.9, 4.3, 4.0],
      marker: { color: "hsl(188, 100%, 42%)" },
    }] as Plotly.Data[],
    layout: { yaxis: { title: { text: "Mean response" } } },
  }), []);

  return (
    <section
      id="intro"
      data-toc={data.eyebrow}
      data-chapter={data.chapter}
      className="snap-section text-white"
      style={{
        backgroundImage: `var(--gradient-hero), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
            {data.chapter}
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {data.eyebrow}
          </span>
        </div>
        <h2 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
          {data.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{data.description}</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
              <Activity className="h-3.5 w-3.5 text-accent" /> Regression preview
            </div>
            <PlotlyChart data={plot.data} layout={plot.layout} height={280} />
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70">
              <BarChart3 className="h-3.5 w-3.5 text-accent" /> Reliability preview
            </div>
            <PlotlyChart data={bar.data} layout={bar.layout} height={280} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] font-medium tracking-widest text-white/60">
        SCROLL <ArrowDown className="h-3 w-3" />
      </div>
    </section>
  );
}

/* — Stat-strip section — */
function StatSection({ data, variant }: { data: any; variant: "odd" | "even" }) {
  return (
    <section id={data.id} data-toc={data.eyebrow} data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <ChapterChip chapter={data.chapter} eyebrow={data.eyebrow} />
        <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{data.title}</h2>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{data.lead}</p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {data.stats.map((s: any) => (
            <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-soft">
              <p className="font-display text-3xl font-bold text-accent sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* — Split (text + bullet list) — */
function SplitSection({ data, variant }: { data: any; variant: "odd" | "even" }) {
  return (
    <section id={data.id} data-toc={data.eyebrow} data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <ChapterChip chapter={data.chapter} eyebrow={data.eyebrow} />
        <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{data.title}</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-muted-foreground">{data.left}</p>
          <ul className="space-y-3">
            {data.right.map((b: string, i: number) => (
              <li key={i} className="flex gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* — Feature grid (KPI cards) — */
function FeatureSection({ data, variant }: { data: any; variant: "odd" | "even" }) {
  return (
    <section id={data.id} data-toc={data.eyebrow} data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <ChapterChip chapter={data.chapter} eyebrow={data.eyebrow} />
        <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{data.title}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {data.items.map((it: any) => (
            <div key={it.label}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-strong">
              <p className="font-display text-3xl font-bold text-primary dark:text-accent">{it.kpi}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-accent">{it.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* — Big-quote section — */
function QuoteSection({ data, variant }: { data: any; variant: "odd" | "even" }) {
  return (
    <section id={data.id} data-toc={data.eyebrow} data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-4xl text-center">
        <ChapterChip chapter={data.chapter} eyebrow={data.eyebrow} />
        <QuoteIcon className="mx-auto h-12 w-12 text-accent/50" />
        <p className="mt-6 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          “{data.quote}”
        </p>
        {data.footnote && (
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">{data.footnote}</p>
        )}
      </div>
    </section>
  );
}

/* — Numbered timeline — */
function TimelineSection({ data, variant }: { data: any; variant: "odd" | "even" }) {
  return (
    <section id={data.id} data-toc={data.eyebrow} data-chapter={data.chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <ChapterChip chapter={data.chapter} eyebrow={data.eyebrow} />
        <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{data.title}</h2>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data.steps.map((s: any) => (
            <li key={s.k} className="relative rounded-2xl border bg-card p-6">
              <span className="font-display text-5xl font-bold text-muted-foreground/30">{s.k}</span>
              <p className="mt-2 font-display text-lg font-bold">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
