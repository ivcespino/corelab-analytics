import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { TocDropdown, type TocItem } from "@/components/TocDropdown";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { PlotlyChart } from "@/components/tool/PlotlyChart";
import { SwipeCarousel } from "@/components/SwipeCarousel";
import { useResponses, type Response } from "@/lib/useResponses";
import {
  ArrowDown, BarChart3, Activity, ScatterChart, TrendingUp,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

/* ─────────────── Page ─────────────── */
export default function Dashboard() {
  const responses = useResponses();
  const [activeId, setActiveId] = useState("dashboard-hero");
  const containerRef = useRef<HTMLDivElement>(null);

  const tocItems: TocItem[] = [
    { id: "dashboard-hero", label: "Overview", chapter: "Dashboard" },
    { id: "respondents",    label: "Respondents", chapter: "Chapter 3 · Results" },
    { id: "descriptive",    label: "Descriptive Stats", chapter: "Chapter 3 · Results" },
    { id: "reliability",    label: "Reliability", chapter: "Chapter 3 · Results" },
    { id: "correlation",    label: "Correlation", chapter: "Chapter 3 · Results" },
    { id: "regression",     label: "Regression", chapter: "Chapter 3 · Results" },
    { id: "summary",        label: "Summary", chapter: "Chapter 4 · Discussion" },
    { id: "usage-grades",   label: "Usage vs Grades", chapter: "Chapter 4 · Discussion" },
    { id: "predictors",     label: "Predictors", chapter: "Chapter 4 · Discussion" },
    { id: "divergence",     label: "Divergence", chapter: "Chapter 4 · Discussion" },
    { id: "synthesis",      label: "Synthesis", chapter: "Chapter 4 · Discussion" },
    { id: "recommendations",label: "Recommendations", chapter: "Chapter 4 · Discussion" },
    { id: "finale",         label: "Continue", chapter: "Continue" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;
    const sections = root.querySelectorAll<HTMLElement>(".snap-section");
    const obs = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v?.target.id) setActiveId(v.target.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [responses]);

  const jumpTo = (id: string) => document.getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!responses) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-muted-foreground">Loading dataset…</p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div ref={containerRef} className="snap-container">
        <DashboardHero responses={responses} jumpTo={jumpTo} />
        <Respondents responses={responses} variant="odd" />
        <Descriptive responses={responses} variant="even" />
        <Reliability responses={responses} variant="odd" />
        <Correlation responses={responses} variant="even" />
        <Regression responses={responses} variant="odd" />
        <SummaryFindings variant="even" />
        <UsageGrades variant="odd" />
        <Predictors variant="even" />
        <Divergence variant="odd" />
        <Synthesis variant="even" />
        <Recommendations variant="odd" />
        <FinaleSection
          data={{
            eyebrow: "Continue",
            title: "Want to dig deeper?",
            description: "Run your own analysis with the tool, revisit the research framing, or meet the team.",
            links: [
              { label: "Open the Tool", href: "/tool", icon: "science" },
              { label: "Back to Home", href: "/", icon: "home" },
              { label: "Meet the Team", href: "/team", icon: "groups" },
            ],
            footer: "© 2025 CoreLab Analytics — ITMAWD 12A research group · STI College Malolos",
          }}
          onBackToTop={() => jumpTo("dashboard-hero")}
        />
      </div>
      <TocDropdown items={tocItems} activeId={activeId} onJump={jumpTo} />
    </>
  );
}

/* ─────────────── Stats helpers ─────────────── */
function mean(xs: number[]) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
function sd(xs: number[]) {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}
function pearson(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  return num / Math.sqrt(dx * dy);
}
function linreg(xs: number[], ys: number[]) {
  const mx = mean(xs), my = mean(ys);
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  return { slope, intercept };
}

/* ─────────────── Common UI ─────────────── */
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

function SectionWrap({ id, chapter, eyebrow, title, variant, children }: {
  id: string; chapter: string; eyebrow: string; title: string;
  variant: "odd" | "even"; children: React.ReactNode;
}) {
  return (
    <section id={id} data-toc={eyebrow} data-chapter={chapter}
      className={`snap-section ${variant === "odd" ? "bg-odd" : "bg-even"}`}>
      <div className="mx-auto w-full max-w-6xl">
        <ChapterChip chapter={chapter} eyebrow={eyebrow} />
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

const tableBase = "w-full border-collapse text-[13px] sm:text-sm";
const th = "border-b border-border bg-muted/50 px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[11px] text-muted-foreground";
const td = "border-b border-border/50 px-3 py-2.5";

/* ─────────────── D-1 Hero with live previews ─────────────── */
function DashboardHero({ responses, jumpTo }: { responses: Response[]; jumpTo: (id: string) => void }) {
  // Scatter: hours vs change
  const scatter = useMemo(() => {
    const xs = responses.map((r) => r.hours);
    const ys = responses.map((r) => r.change);
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys, name: "Students",
          marker: { color: "hsl(188, 100%, 55%)", size: 7, opacity: 0.75 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: { color: "hsl(188, 100%, 80%)", width: 2.5 }, name: "Trend" },
      ] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: "Lab Hours / week" }, yaxis: { title: "Performance Δ" } },
    };
  }, [responses]);

  // Bars: prelim vs midterm
  const bars = useMemo(() => {
    const buckets = ["75–79", "80–84", "85–89", "90–94", "95–100"];
    const bin = (g: number) => g < 80 ? 0 : g < 85 ? 1 : g < 90 ? 2 : g < 95 ? 3 : 4;
    const prelim = [0,0,0,0,0]; const mid = [0,0,0,0,0];
    responses.forEach((r) => { prelim[bin(r.prelim)]++; mid[bin(r.midterm)]++; });
    return {
      data: [
        { type: "bar", name: "Preliminary", x: buckets, y: prelim, marker: { color: "hsl(231, 65%, 65%)" } },
        { type: "bar", name: "Midterm",     x: buckets, y: mid,    marker: { color: "hsl(188, 100%, 55%)" } },
      ] as Plotly.Data[],
      layout: { barmode: "group", showlegend: true, yaxis: { title: "Students" } },
    };
  }, [responses]);

  // Subjects
  const subjectBars = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach((r) => { counts[r.subject] = (counts[r.subject] ?? 0) + 1; });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      data: [{
        type: "bar", orientation: "h",
        x: entries.map((e) => e[1]),
        y: entries.map((e) => e[0].length > 24 ? e[0].slice(0, 22) + "…" : e[0]),
        marker: { color: "hsl(231, 65%, 70%)" },
      }] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: "Responses" }, margin: { l: 160 } },
    };
  }, [responses]);

  // Regression preview (intensity vs grade)
  const regPreview = useMemo(() => {
    const xs = responses.map((r) => r.intensity);
    const ys = responses.map((r) => r.midterm);
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys, name: "Students",
          marker: { color: "hsl(188, 100%, 55%)", size: 7, opacity: 0.75 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: { color: "hsl(188, 100%, 80%)", width: 2.5 }, name: "Trend" },
      ] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: "Intensity" }, yaxis: { title: "Midterm Grade" } },
    };
  }, [responses]);

  const tiles = [
    { key: "correlation", title: "Correlation Scatter", icon: ScatterChart, data: scatter, target: "correlation" },
    { key: "descriptive", title: "Grade Distribution",  icon: BarChart3,    data: bars,    target: "descriptive" },
    { key: "regression",  title: "Regression Trend",    icon: TrendingUp,   data: regPreview, target: "regression" },
    { key: "respondents", title: "Respondents by Subject", icon: Activity,  data: subjectBars, target: "respondents" },
  ];

  return (
    <section
      id="dashboard-hero"
      data-toc="Overview"
      data-chapter="Dashboard"
      className="snap-section text-white"
      style={{
        backgroundImage: `var(--gradient-hero), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] backdrop-blur">
            Dashboard
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Visualization
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl">
          Findings, visualized
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
          The following findings were generated using this tool. Each visualization corresponds to a section of the results — tap a chart to jump straight to the analysis.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {tiles.map((t) => (
            <button
              key={t.key}
              onClick={() => jumpTo(t.target)}
              className="group rounded-2xl border border-white/15 bg-white/5 p-3 text-left backdrop-blur transition-all hover:-translate-y-1 hover:border-accent hover:bg-white/10"
            >
              <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <t.icon className="h-3.5 w-3.5 text-accent" />
                {t.title}
              </div>
              <PlotlyChart data={t.data.data} layout={t.data.layout as any} height={170} />
            </button>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] font-medium tracking-widest text-white/60">
        SCROLL <ArrowDown className="h-3 w-3" />
      </div>
    </section>
  );
}

/* ─────────────── D-2 Respondents ─────────────── */
function Respondents({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    responses.forEach((r) => { c[r.subject] = (c[r.subject] ?? 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [responses]);

  return (
    <SectionWrap id="respondents" chapter="Chapter 3 · Results" eyebrow="Profile" title="Profile of the Respondents" variant={variant}>
      <div className="mb-6 grid gap-2 sm:grid-cols-4">
        {[
          { k: "N", v: String(responses.length) },
          { k: "Sampling", v: "Purposive" },
          { k: "Population", v: "406 (excl. 4th yr)" },
          { k: "Span", v: "Multiple semesters · Y1–3" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border bg-card px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.k}</p>
            <p className="font-display text-lg font-bold">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className={tableBase}>
          <thead><tr><th className={th}>Core IT Subject</th><th className={`${th} text-right`}>Responses</th></tr></thead>
          <tbody>
            {counts.map(([s, n]) => (
              <tr key={s}><td className={td}>{s}</td><td className={`${td} text-right font-mono`}>{n}</td></tr>
            ))}
            <tr className="bg-muted/30 font-bold">
              <td className={td}>Total</td>
              <td className={`${td} text-right font-mono`}>{responses.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">
        Responses reflect historical academic records across multiple semesters. No single concurrent term. This distribution is addressed in the interpretation of findings.
      </p>
    </SectionWrap>
  );
}

/* ─────────────── D-3 Descriptive ─────────────── */
function Descriptive({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const rows = useMemo(() => {
    const cols = [
      { name: "Frequency (Weekly Lab Hours)", vals: responses.map((r) => r.hours) },
      { name: "Intensity (Composite Behavioral Score)", vals: responses.map((r) => r.intensity) },
      { name: "Preliminary Grade", vals: responses.map((r) => r.prelim) },
      { name: "Midterm Grade", vals: responses.map((r) => r.midterm) },
      { name: "Performance Change Score", vals: responses.map((r) => r.change), signed: true },
    ];
    return cols.map((c) => {
      const m = mean(c.vals); const s = sd(c.vals);
      const fmt = (n: number) => c.signed && n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2);
      return { name: c.name, mean: fmt(m), sd: s.toFixed(2),
        min: c.signed ? (Math.min(...c.vals) > 0 ? `+${Math.min(...c.vals)}` : String(Math.min(...c.vals))) : Math.min(...c.vals).toString(),
        max: c.signed ? (Math.max(...c.vals) > 0 ? `+${Math.max(...c.vals)}` : String(Math.max(...c.vals))) : Math.max(...c.vals).toString() };
    });
  }, [responses]);

  const bars = useMemo(() => {
    const buckets = ["75–79", "80–84", "85–89", "90–94", "95–100"];
    const bin = (g: number) => g < 80 ? 0 : g < 85 ? 1 : g < 90 ? 2 : g < 95 ? 3 : 4;
    const p = [0,0,0,0,0]; const m = [0,0,0,0,0];
    responses.forEach((r) => { p[bin(r.prelim)]++; m[bin(r.midterm)]++; });
    return {
      data: [
        { type: "bar", name: "Preliminary", x: buckets, y: p, marker: { color: "hsl(231, 65%, 50%)" } },
        { type: "bar", name: "Midterm",     x: buckets, y: m, marker: { color: "hsl(188, 100%, 42%)" } },
      ] as Plotly.Data[],
      layout: { barmode: "group", yaxis: { title: "Students" } },
    };
  }, [responses]);

  return (
    <SectionWrap id="descriptive" chapter="Chapter 3 · Results" eyebrow="Descriptive Statistics" title="Descriptive Statistics" variant={variant}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className={tableBase}>
            <thead><tr>
              <th className={th}>Variable</th>
              <th className={`${th} text-right`}>Mean</th>
              <th className={`${th} text-right`}>SD</th>
              <th className={`${th} text-right`}>Min</th>
              <th className={`${th} text-right`}>Max</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className={td}>{r.name}</td>
                  <td className={`${td} text-right font-mono`}>{r.mean}</td>
                  <td className={`${td} text-right font-mono`}>{r.sd}</td>
                  <td className={`${td} text-right font-mono`}>{r.min}</td>
                  <td className={`${td} text-right font-mono`}>{r.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade distribution</p>
          <PlotlyChart data={bars.data} layout={bars.layout as any} height={260} />
        </div>
      </div>
      <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
        <p className="text-sm leading-relaxed">
          Mean Performance Change Score = <strong>+1.30</strong>, indicating a general trend of improvement.
          The wide range (−13 to +13) signals that improvement was not uniform across respondents.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-4 Reliability ─────────────── */
function Reliability({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const items = useMemo(() => {
    const reverse = (xs: number[]) => xs.map((x) => 6 - x);
    const cols = [
      { name: "Q8.1: Active coding or programming", vals: responses.map((r) => r.q1) },
      { name: "Q8.2: Reviewing theoretical concepts (Reverse-Coded)", vals: reverse(responses.map((r) => r.q2)) },
      { name: "Q8.3: Executing technical configurations", vals: responses.map((r) => r.q3) },
      { name: "Q8.4: Non-academic activities (Reverse-Coded)", vals: reverse(responses.map((r) => r.q4)) },
      { name: "Q8.5: Debugging or troubleshooting", vals: responses.map((r) => r.q5) },
    ];
    return cols.map((c) => ({ name: c.name, sd: sd(c.vals).toFixed(2) }));
  }, [responses]);
  const compositeSd = useMemo(() => sd(responses.map((r) => r.intensity)).toFixed(2), [responses]);

  return (
    <SectionWrap id="reliability" chapter="Chapter 3 · Results" eyebrow="Reliability" title="Reliability Analysis — Composite Behavioral Score (Intensity)" variant={variant}>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className={tableBase}>
          <thead><tr><th className={th}>Item</th><th className={`${th} text-right`}>SD</th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.name}><td className={td}>{r.name}</td><td className={`${td} text-right font-mono`}>{r.sd}</td></tr>
            ))}
            <tr className="bg-muted/30">
              <td className={td}><strong>Composite Score (Intensity)</strong></td>
              <td className={`${td} text-right font-mono font-bold`}>{compositeSd}</td>
            </tr>
            <tr className="bg-accent/10">
              <td className={td}><strong>Cronbach's Alpha</strong></td>
              <td className={`${td} text-right font-mono font-bold text-accent`}>0.70</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
        <p className="text-sm leading-relaxed">
          <strong>α = 0.70</strong> — Acceptable internal consistency. The five items reliably measure a common construct: the intensity of active technical engagement during laboratory sessions.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-5 Correlation ─────────────── */
function Correlation({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const rows = useMemo(() => {
    const hours = responses.map((r) => r.hours);
    const intensity = responses.map((r) => r.intensity);
    const prelim = responses.map((r) => r.prelim);
    const mid = responses.map((r) => r.midterm);
    return [
      { i: "PR-1", iv: "Weekly Hours (Frequency)",    dv: "Preliminary Grade", r: pearson(hours, prelim),     p: 0.1610, sig: false },
      { i: "PR-2", iv: "Composite Score (Intensity)", dv: "Preliminary Grade", r: pearson(intensity, prelim), p: 0.0008, sig: true },
      { i: "PR-3", iv: "Weekly Hours (Frequency)",    dv: "Midterm Grade",     r: pearson(hours, mid),        p: 0.0044, sig: true },
      { i: "PR-4", iv: "Composite Score (Intensity)", dv: "Midterm Grade",     r: pearson(intensity, mid),    p: 0.00009, sig: true },
    ];
  }, [responses]);

  const scatter = useMemo(() => {
    const xs = responses.map((r) => r.intensity);
    const ys = responses.map((r) => r.midterm);
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys, name: "Students",
          marker: { color: "hsl(188, 100%, 42%)", size: 8, opacity: 0.75 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: { color: "hsl(231, 65%, 30%)", width: 2.5 }, name: "Trend" },
      ] as Plotly.Data[],
      layout: { xaxis: { title: "Intensity (composite)" }, yaxis: { title: "Midterm Grade" } },
    };
  }, [responses]);

  return (
    <SectionWrap id="correlation" chapter="Chapter 3 · Results" eyebrow="Correlation" title="Correlation Analysis (Pearson r)" variant={variant}>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className={tableBase}>
            <thead><tr>
              <th className={th}>#</th>
              <th className={th}>Independent</th>
              <th className={th}>Dependent</th>
              <th className={`${th} text-right`}>r</th>
              <th className={`${th} text-right`}>p</th>
              <th className={`${th} text-center`}>Sig?</th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.i}>
                  <td className={`${td} font-mono text-xs`}>{r.i}</td>
                  <td className={td}>{r.iv}</td>
                  <td className={td}>{r.dv}</td>
                  <td className={`${td} text-right font-mono`}>{r.r.toFixed(4)}</td>
                  <td className={`${td} text-right font-mono`}>{r.p < 0.0001 ? "<0.0001" : r.p.toFixed(4)}</td>
                  <td className={`${td} text-center`}>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${r.sig ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {r.sig ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Intensity vs Midterm</p>
          <PlotlyChart data={scatter.data} layout={scatter.layout as any} height={260} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
          <p className="text-sm leading-relaxed">
            <strong>At Preliminary:</strong> only Intensity is significant (p = 0.0008). Frequency is not (p = 0.161). Being present in the lab does not correlate with early grade achievement — active technical engagement does.
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
          <p className="text-sm leading-relaxed">
            <strong>By Midterm:</strong> both metrics are significant. Intensity remains the stronger correlate (r = 0.41 vs r = 0.30).
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-6 Regression (carousel) ─────────────── */
function Regression({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const trend = useMemo(() => {
    const xs = responses.map((r) => r.hours);
    const ys = responses.map((r) => r.change);
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys,
          marker: { color: "hsl(188, 100%, 42%)", size: 8, opacity: 0.75 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: { color: "hsl(231, 65%, 30%)", width: 2.5 } },
      ] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: "Weekly Hours (Frequency)" }, yaxis: { title: "Performance Δ" } },
    };
  }, [responses]);

  const summary = (
    <>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className={tableBase}>
            <thead><tr>
              <th className={th}>Model</th><th className={th}>Predictor(s)</th>
              <th className={`${th} text-right`}>R²</th><th className={`${th} text-right`}>F</th>
              <th className={`${th} text-right`}>p</th><th className={`${th} text-center`}>Sig?</th>
            </tr></thead>
            <tbody>
              {[
                { m: "A", p: "Weekly Hours only", r2: "0.0728", F: "6.5940", pv: "0.0120", s: true },
                { m: "B", p: "Composite Score only", r2: "0.0153", F: "1.3009", pv: "0.2573", s: false },
                { m: "C", p: "Both (Combined)", r2: "0.0733", F: "3.2847", pv: "0.0424", s: true },
              ].map((r) => (
                <tr key={r.m}>
                  <td className={`${td} font-mono`}>{r.m}</td>
                  <td className={td}>{r.p}</td>
                  <td className={`${td} text-right font-mono`}>{r.r2}</td>
                  <td className={`${td} text-right font-mono`}>{r.F}</td>
                  <td className={`${td} text-right font-mono`}>{r.pv}</td>
                  <td className={`${td} text-center`}>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${r.s ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {r.s ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hours vs Performance Δ</p>
          <PlotlyChart data={trend.data} layout={trend.layout as any} height={260} />
        </div>
      </div>
      <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
        <p className="text-sm leading-relaxed">
          Model C is statistically significant (p = 0.0424). The combined model explains <strong>7.33%</strong> of variance in the Performance Change Score.
          <strong> H₀₁ is rejected:</strong> laboratory usage significantly predicts academic performance change.
        </p>
      </div>
    </>
  );

  const coefficients = (
    <>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className={tableBase}>
          <thead><tr>
            <th className={th}>Model</th><th className={th}>Predictor</th>
            <th className={`${th} text-right`}>B</th><th className={`${th} text-right`}>SE</th>
            <th className={`${th} text-right`}>t</th><th className={`${th} text-right`}>p</th>
          </tr></thead>
          <tbody>
            {[
              { m: "A", p: "Weekly Hours",    B: "0.4499", SE: "0.1752", t: "2.5679", pv: "0.0120" },
              { m: "B", p: "Composite Score", B: "0.1315", SE: "0.1153", t: "1.1406", pv: "0.2573" },
              { m: "C", p: "Weekly Hours",    B: "0.4339", SE: "0.1902", t: "2.2811", pv: "0.0251" },
              { m: "C", p: "Composite Score", B: "0.0271", SE: "0.1214", t: "0.2234", pv: "0.8238" },
            ].map((r, i) => (
              <tr key={i}>
                <td className={`${td} font-mono`}>{r.m}</td>
                <td className={td}>{r.p}</td>
                <td className={`${td} text-right font-mono`}>{r.B}</td>
                <td className={`${td} text-right font-mono`}>{r.SE}</td>
                <td className={`${td} text-right font-mono`}>{r.t}</td>
                <td className={`${td} text-right font-mono`}>{r.pv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4 text-sm leading-relaxed">
        <p>In the combined model: Frequency is significant (p = 0.0251). Intensity is not (p = 0.8238).</p>
        <p className="mt-2 font-mono text-xs sm:text-[13px]">
          Score = −0.9915 + (0.4339 × Weekly Hours) + (0.0271 × Composite Score)
        </p>
        <p className="mt-2">Every additional weekly lab hour predicts <strong>+0.43</strong> points of improvement between grading periods.</p>
      </div>
    </>
  );

  return (
    <SectionWrap id="regression" chapter="Chapter 3 · Results" eyebrow="Regression" title="Regression Analysis" variant={variant}>
      <SwipeCarousel ariaLabel="Regression analysis" panels={[
        <div key="0">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Model Summary</p>
          {summary}
        </div>,
        <div key="1">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">Coefficients</p>
          {coefficients}
        </div>,
      ]} />
    </SectionWrap>
  );
}

/* ─────────────── D-7 Summary ─────────────── */
function SummaryFindings({ variant }: { variant: "odd" | "even" }) {
  const items = [
    { k: "01", text: "Intensity (Composite Behavioral Score) is the stronger correlate of absolute academic performance at both grading periods — r = 0.36 at Preliminary, r = 0.41 at Midterm." },
    { k: "02", text: "Frequency (Weekly Lab Hours) is the sole statistically significant predictor of performance improvement between periods — p = 0.0251, B = 0.4339." },
    { k: "03", text: "The combined regression model is significant (p = 0.0424). H₀₁ is rejected. Laboratory usage is associated with measurable academic progress." },
  ];
  return (
    <SectionWrap id="summary" chapter="Chapter 4 · Discussion" eyebrow="Summary" title="Summary of Findings" variant={variant}>
      <ol className="grid gap-4 md:grid-cols-3">
        {items.map((it) => (
          <li key={it.k} className="rounded-2xl border bg-card p-6 shadow-soft">
            <span className="font-display text-5xl font-bold text-muted-foreground/30">{it.k}</span>
            <p className="mt-3 text-sm leading-relaxed">{it.text}</p>
          </li>
        ))}
      </ol>
    </SectionWrap>
  );
}

/* ─────────────── D-8 Usage vs Grades ─────────────── */
function UsageGrades({ variant }: { variant: "odd" | "even" }) {
  const Col = ({ title, items, interp }: { title: string; items: { k: string; v: string; sig: boolean }[]; interp: string }) => (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</p>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.k} className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
            <span className="text-sm font-semibold">{i.k}</span>
            <span className={`text-right font-mono text-sm ${i.sig ? "text-accent" : "text-muted-foreground"}`}>{i.v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm italic leading-relaxed text-muted-foreground">{interp}</p>
    </div>
  );
  return (
    <SectionWrap id="usage-grades" chapter="Chapter 4 · Discussion" eyebrow="Usage & Grades" title="Usage Metrics and Absolute Grades" variant={variant}>
      <div className="grid gap-4 md:grid-cols-2">
        <Col title="Preliminary Period"
          items={[
            { k: "Frequency", v: "r = 0.15, p = 0.161 (NS)", sig: false },
            { k: "Intensity", v: "r = 0.36, p = 0.001 (Sig)", sig: true },
          ]}
          interp="Initial academic standing is tied to quality of engagement, not quantity of time." />
        <Col title="Midterm Period"
          items={[
            { k: "Frequency", v: "r = 0.30, p = 0.004 (Sig)", sig: true },
            { k: "Intensity", v: "r = 0.41, p < 0.001 (Sig)", sig: true },
          ]}
          interp="By Midterm, consistent attendance becomes measurable — but depth of engagement retains its edge." />
      </div>
      <div className="mt-5 rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
        <p className="text-sm leading-relaxed">
          Simply being present in the laboratory does not correlate with high early grades. <strong>Active technical engagement does.</strong> Over time, both matter — but intensity maintains the stronger association.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-9 Predictors ─────────────── */
function Predictors({ variant }: { variant: "odd" | "even" }) {
  const stats = [
    { k: "H₀₁ Status", v: "REJECTED", sub: "p = 0.0424", hl: true },
    { k: "Mean Performance Δ", v: "+1.30", sub: "range −13 to +13" },
    { k: "R²", v: "0.0733", sub: "7.33% of variance" },
    { k: "Frequency", v: "Significant", sub: "p = 0.0251 · B = 0.4339", hl: true },
    { k: "Intensity", v: "Not significant", sub: "p = 0.8238 (combined)" },
  ];
  return (
    <SectionWrap id="predictors" chapter="Chapter 4 · Discussion" eyebrow="Predictors" title="Predictors of Performance Change" variant={variant}>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.k} className={`rounded-xl border p-4 ${s.hl ? "border-accent bg-accent/5" : "bg-card"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.k}</p>
            <p className={`mt-2 font-display text-xl font-bold ${s.hl ? "text-accent" : ""}`}>{s.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border-l-4 border-l-accent bg-accent/5 p-5">
        <p className="text-base leading-relaxed sm:text-lg">
          Every additional hour per week in the laboratory predicts approximately <strong>+0.43 points</strong> of improvement between the Preliminary and Midterm grades.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-10 Divergence (carousel) ─────────────── */
function Divergence({ variant }: { variant: "odd" | "even" }) {
  const Pair = ({ title, role, body }: { title: string; role: string; body: string }) => (
    <div className="rounded-2xl border bg-card p-6 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-3 text-sm font-semibold">Role: {role}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
  return (
    <SectionWrap id="divergence" chapter="Chapter 4 · Discussion" eyebrow="Divergence" title="A Discovery: Intensity vs Frequency" variant={variant}>
      <SwipeCarousel ariaLabel="Divergent findings" panels={[
        <div key="0">
          <p className="mb-4 text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            The study set out expecting both dimensions of laboratory usage to contribute to performance improvement. The data revealed otherwise.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <Pair title="Intensity" role="Strongest correlate of absolute grade level"
              body="Associated with students who already perform well — likely reflects existing skill or engagement habits rather than growth. Students with high prior ability maintain high scores across both periods, limiting Intensity's predictive effect on change (ceiling effect)." />
            <Pair title="Frequency" role="Sole significant predictor of performance change"
              body="Consistent attendance creates repeated contact with course material across all skill levels. The accumulation of hours provides the environment where learning cycles can occur — improvement becomes measurable regardless of the student's prior ability or engagement style." />
          </div>
        </div>,
        <div key="1" className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Contextual Considerations</p>
          <p className="mt-4 text-base leading-relaxed">
            Respondent data spans Year 1 through Year 3 subjects across multiple previous semesters. The mixed distribution means the predictive strength of Frequency reflects a general trend across the BSIT curriculum rather than a finding from one academic level. Both foundational subjects (Computer Programming 1 and 2) and more advanced subjects (Event-Driven Programming) are represented.
          </p>
          <p className="mt-4 rounded-xl bg-muted/40 p-4 text-sm leading-relaxed">
            <strong>Data preparation note:</strong> One outlier in the Frequency metric (20 reported weekly hours) was Winsorized to 10 hours — the nearest non-outlier value — prior to regression to prevent distortion of the predictive model.
          </p>
        </div>,
      ]} />
    </SectionWrap>
  );
}

/* ─────────────── D-11 Synthesis (carousel) ─────────────── */
function Synthesis({ variant }: { variant: "odd" | "even" }) {
  const panels = [
    {
      tag: "Synthesis",
      heading: "Synthesis",
      body: "The findings align with all three theoretical frameworks. Experiential Learning Theory (Kolb, 1984) accounts for Frequency as the predictor of change: repeated laboratory attendance provides the iterative experience cycle through which skills are built. Cognitive Load Theory (Sweller, 1988) explains why consistent access matters: regular attendance reduces logistical friction and reallocates cognitive effort toward learning. Constructivist Learning Theory (Vygotsky, 1978; Piaget, 1972) explains why Intensity correlates with absolute grade standing: active technical engagement is the mechanism of knowledge construction. Frequency is the condition for improvement. Intensity is the condition for high performance.",
    },
    {
      tag: "Convergence",
      heading: "Convergence with Literature",
      body: "The finding that consistent laboratory exposure predicts performance change aligns with Vahid et al. (2023), who found that regular coding practice produces measurably better outcomes. The role of Intensity in correlating with absolute grades echoes Canoy et al. (2023) and Cadiz-Gabejan and Takenaka (2021), who found that structured, active engagement supports stronger academic standing.",
    },
    {
      tag: "Divergence",
      heading: "Where This Study Extends Prior Work",
      body: "Prior studies treat laboratory usage as a single construct. This study separates Frequency from Intensity and demonstrates that they serve different functions in academic outcomes. No reviewed study directly examines intra-term performance shift — the change between Preliminary and Midterm grades — as the dependent variable. The identification of Frequency as the predictor of that change, and Intensity as the correlate of grade level, is a contribution that prior literature did not anticipate or test.",
    },
  ];
  return (
    <SectionWrap id="synthesis" chapter="Chapter 4 · Discussion" eyebrow="Synthesis" title="Synthesis with Theory and Literature" variant={variant}>
      <SwipeCarousel ariaLabel="Synthesis" panels={panels.map((p, i) => (
        <div key={i} className="rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{p.tag}</p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{p.heading}</h3>
          <p className="mt-4 text-base leading-relaxed text-foreground/90">{p.body}</p>
        </div>
      ))} />
    </SectionWrap>
  );
}

/* ─────────────── D-12 Recommendations (carousel) ─────────────── */
function Recommendations({ variant }: { variant: "odd" | "even" }) {
  const summary = [
    "Consistent laboratory attendance is the primary institutional lever for improving student academic performance across a term.",
    "High engagement quality (Intensity) is associated with high grade achievement but does not drive improvement on its own.",
    "Policies focused solely on enhancing engagement quality without ensuring access frequency will not fully address performance development.",
  ];
  const recs = [
    { who: "Institution (STI College Malolos)", what: "Ensure consistent scheduling and availability of computer laboratory sessions, particularly for foundational subjects. Review laboratory allocation systems to minimize access barriers across the academic term." },
    { who: "Instructors", what: "Design laboratory activities that build progressively across the term. Prioritize consistent attendance expectations alongside the quality of engagement during sessions." },
    { who: "Students", what: "Maintain consistent laboratory attendance. Pair regular attendance with active technical engagement — both dimensions contribute to overall learning outcomes." },
    { who: "Future Researchers", what: "Examine additional predictors of performance change such as prior knowledge, study habits, and instructional quality. Extend scope to 4th-year students. Test whether the Frequency–Intensity divergence pattern holds in other academic disciplines." },
  ];
  return (
    <SectionWrap id="recommendations" chapter="Chapter 4 · Discussion" eyebrow="Recommendations" title="Implications and Recommendations" variant={variant}>
      <SwipeCarousel ariaLabel="Recommendations" panels={[
        <div key="0">
          <ol className="grid gap-3 md:grid-cols-3">
            {summary.map((s, i) => (
              <li key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
                <span className="font-display text-3xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 text-sm leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>
        </div>,
        <div key="1" className="grid gap-4 md:grid-cols-2">
          {recs.map((r) => (
            <div key={r.who} className="rounded-2xl border bg-card p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{r.who}</p>
              <p className="mt-2 text-sm leading-relaxed">{r.what}</p>
            </div>
          ))}
        </div>,
      ]} />
    </SectionWrap>
  );
}
