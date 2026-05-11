import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { TocDropdown, type TocItem } from "@/components/TocDropdown";
import { FinaleSection } from "@/components/sections/FinaleSection";
import { ChapterDividerSection } from "@/components/sections/ResearchSections";
import { PlotlyChart } from "@/components/tool/PlotlyChart";

import { useResponses, type Response } from "@/lib/useResponses";
import {
  ArrowDown, BarChart3, Activity, ScatterChart, TrendingUp,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

/* ─────────────── Subject label map ─────────────── */
const SUBJECT_SHORT: Record<string, string> = {
  "Computer Programming 1": "CP1",
  "Computer Programming 2": "CP2",
  "Event-Driven Programming": "EDP",
  "Systems Administration and Maintenance": "SAM",
  "Introduction to Computing": "ITC",
};
const shortSubject = (s: string) => SUBJECT_SHORT[s] ?? s;

/* ─────────────── Page ─────────────── */
export default function Dashboard() {
  const responses = useResponses();
  const [activeId, setActiveId] = useState("dashboard-hero");
  const containerRef = useRef<HTMLDivElement>(null);

  const tocItems: TocItem[] = [
    { id: "dashboard-hero",     label: "Overview", chapter: "Dashboard" },
    { id: "ch3-divider",        label: "Chapter 3 · Results", chapter: "Chapter 3 · Results" },
    { id: "respondents",        label: "Profile of the Respondents", chapter: "Chapter 3 · Results" },
    { id: "descriptive",        label: "Descriptive Statistics", chapter: "Chapter 3 · Results" },
    { id: "reliability",        label: "Reliability Analysis", chapter: "Chapter 3 · Results" },
    { id: "correlation",        label: "Correlation— Summary", chapter: "Chapter 3 · Results" },
    { id: "correlation-pr1",    label: "PR-1 · Frequency × Prelim", chapter: "Chapter 3 · Results" },
    { id: "correlation-pr2",    label: "PR-2 · Intensity × Prelim", chapter: "Chapter 3 · Results" },
    { id: "correlation-pr3",    label: "PR-3 · Frequency × Midterm", chapter: "Chapter 3 · Results" },
    { id: "correlation-pr4",    label: "PR-4 · Intensity × Midterm", chapter: "Chapter 3 · Results" },
    { id: "regression",         label: "Regression— Model Summary", chapter: "Chapter 3 · Results" },
    { id: "regression-model-a", label: "Model A · Frequency only", chapter: "Chapter 3 · Results" },
    { id: "regression-model-b", label: "Model B · Intensity only", chapter: "Chapter 3 · Results" },
    { id: "regression-model-c", label: "Model C · Combined", chapter: "Chapter 3 · Results" },
    { id: "regression-coef",    label: "Regression— Coefficients", chapter: "Chapter 3 · Results" },
    { id: "summary",            label: "Summary of Findings", chapter: "Chapter 3 · Results" },
    { id: "ch4-divider",        label: "Chapter 4 · Discussion", chapter: "Chapter 4 · Discussion" },
    { id: "usage-grades",       label: "Usage Metrics & Grades", chapter: "Chapter 4 · Discussion" },
    { id: "predictors",         label: "Predictors of Change", chapter: "Chapter 4 · Discussion" },
    { id: "divergence",         label: "Intensity vs Frequency", chapter: "Chapter 4 · Discussion" },
    { id: "divergence-ctx",     label: "Contextual Considerations", chapter: "Chapter 4 · Discussion" },
    { id: "synthesis",          label: "Synthesis with Theory", chapter: "Chapter 4 · Discussion" },
    { id: "convergence",        label: "Convergence with Literature", chapter: "Chapter 4 · Discussion" },
    { id: "extension",          label: "Extension of Prior Work", chapter: "Chapter 4 · Discussion" },
    { id: "implications",       label: "Implications", chapter: "Chapter 4 · Discussion" },
    { id: "recommendations",    label: "Recommendations", chapter: "Chapter 4 · Discussion" },
    { id: "finale",             label: "Continue", chapter: "Continue" },
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

        <ChapterDividerSection
          variant="odd"
          data={{
            id: "ch3-divider", chapter: "Chapter 3", eyebrow: "Results", title: "Results",
            number: "3",
            lead: "What the data revealed— profile, descriptive statistics, reliability, correlation, and regression— culminating in the summary of findings.",
            toc: [
              { label: "Profile of the Respondents", id: "respondents" },
              { label: "Descriptive Statistics", id: "descriptive" },
              { label: "Reliability Analysis", id: "reliability" },
              { label: "Correlation Analysis", id: "correlation" },
              { label: "Regression Analysis", id: "regression" },
              { label: "Summary of Findings", id: "summary" },
            ],
          }}
        />
        <Respondents responses={responses} variant="even" />
        <Descriptive responses={responses} variant="odd" />
        <Reliability responses={responses} variant="even" />
        <CorrelationSummary responses={responses} variant="odd" />
        <PearsonDeepDive
          id="correlation-pr1" code="PR-1" variant="even"
          title="Frequency × Preliminary Grade"
          xs={responses.map(r => r.hours)} ys={responses.map(r => r.prelim)}
          xLabel="Weekly Lab Hours" yLabel="Preliminary Grade"
          r={pearson(responses.map(r => r.hours), responses.map(r => r.prelim))}
          p={0.1610} sig={false}
          read="Hours alone don't predict early-term grades. Students who log many hours but engage passively don't outperform those who log fewer, more focused hours. Frequency does not yet matter— quality does."
        />
        <PearsonDeepDive
          id="correlation-pr2" code="PR-2" variant="odd"
          title="Intensity × Preliminary Grade"
          xs={responses.map(r => r.intensity)} ys={responses.map(r => r.prelim)}
          xLabel="Composite Behavioral Score" yLabel="Preliminary Grade"
          r={pearson(responses.map(r => r.intensity), responses.map(r => r.prelim))}
          p={0.0008} sig={true}
          read="Active technical engagement (coding, debugging, configuration) correlates with higher Preliminary grades. The strongest single signal at the start of the term is depth of engagement, not amount of time spent."
        />
        <PearsonDeepDive
          id="correlation-pr3" code="PR-3" variant="even"
          title="Frequency × Midterm Grade"
          xs={responses.map(r => r.hours)} ys={responses.map(r => r.midterm)}
          xLabel="Weekly Lab Hours" yLabel="Midterm Grade"
          r={pearson(responses.map(r => r.hours), responses.map(r => r.midterm))}
          p={0.0044} sig={true}
          read="By Midterm, accumulated exposure starts to show. Students who consistently attend lab sessions outperform those who do not. Frequency 'wakes up' as a correlate once enough cycles of practice have accumulated."
        />
        <PearsonDeepDive
          id="correlation-pr4" code="PR-4" variant="odd"
          title="Intensity × Midterm Grade"
          xs={responses.map(r => r.intensity)} ys={responses.map(r => r.midterm)}
          xLabel="Composite Behavioral Score" yLabel="Midterm Grade"
          r={pearson(responses.map(r => r.intensity), responses.map(r => r.midterm))}
          p={0.00009} sig={true}
          read="Intensity is the strongest correlation in the entire study (r = 0.41). Active engagement keeps its lead even as Frequency catches up— depth of work consistently maps to higher grades."
        />

        <RegressionSummary responses={responses} variant="even" />
        <RegressionDeepDive
          id="regression-model-a" model="A" variant="odd"
          title="Model A · Frequency only"
          xs={responses.map(r => r.hours)} ys={responses.map(r => r.change)}
          xLabel="Weekly Lab Hours" yLabel="Performance Δ"
          R2={0.0728} F={6.5940} p={0.0120}
          beta={0.4499} betaP={0.0120}
          formula="Δ = −0.987 + (0.4499 × Hours)"
          read="A simple regression on Frequency alone is significant. Each extra hour per week predicts roughly +0.45 grade points of improvement between Preliminary and Midterm. Time-on-task— even without controlling for engagement quality— predicts measurable progress."
        />
        <RegressionDeepDive
          id="regression-model-b" model="B" variant="even"
          title="Model B · Intensity only"
          xs={responses.map(r => r.intensity)} ys={responses.map(r => r.change)}
          xLabel="Composite Behavioral Score" yLabel="Performance Δ"
          R2={0.0153} F={1.3009} p={0.2573}
          beta={0.1315} betaP={0.2573}
          formula="Δ = −0.844 + (0.1315 × Intensity)"
          read="When Intensity is the only predictor, the model is not significant (p = 0.26). High-engagement students often start high and stay high (ceiling effect)— so Intensity barely predicts change between periods, even though it strongly predicts absolute grade level."
        />
        <RegressionDeepDive
          id="regression-model-c" model="C" variant="odd"
          title="Model C · Combined (Frequency + Intensity)"
          xs={responses.map(r => 0.4339 * r.hours + 0.0271 * r.intensity - 0.9915)}
          ys={responses.map(r => r.change)}
          xLabel="Predicted Δ" yLabel="Observed Δ"
          R2={0.0733} F={3.2847} p={0.0424}
          beta={0.4339} betaP={0.0251}
          formula="Δ = −0.9915 + (0.4339 × Hours) + (0.0271 × Intensity)"
          read="The combined model is significant (p = 0.0424) and confirms the divergence: Frequency stays significant (p = 0.0251) while Intensity loses significance (p = 0.82) once Frequency is controlled. The chart compares predicted vs observed Δ— a perfect model would have all points on the dashed diagonal."
          observedVsPredicted
        />
        <RegressionCoefficients variant="even" />
        <SummaryFindings variant="odd" />

        <ChapterDividerSection
          variant="even"
          data={{
            id: "ch4-divider", chapter: "Chapter 4", eyebrow: "Discussion", title: "Discussion",
            number: "4",
            lead: "Reading the numbers— what the divergent results mean, how they fit theory and prior research, and what should change because of them.",
            toc: [
              { label: "Usage Metrics & Grades", id: "usage-grades" },
              { label: "Predictors of Performance Change", id: "predictors" },
              { label: "Interpretation of Divergent Findings", id: "divergence" },
              { label: "Synthesis with Framework & Literature", id: "synthesis" },
              { label: "Implications and Recommendations", id: "implications" },
            ],
          }}
        />
        <UsageGrades variant="odd" />
        <Predictors variant="even" />
        <DivergenceMain variant="odd" />
        <DivergenceContext variant="even" />
        <SynthesisTheory variant="odd" />
        <ConvergenceLit variant="even" />
        <ExtensionWork variant="odd" />
        <ImplicationsSummary variant="even" />
        <RecommendationsByAudience variant="odd" />
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
            footer: "© 2025 CoreLab Analytics— ITMAWD 12A research group · STI College Malolos",
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
    <div className="mb-4 flex items-center gap-3">
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
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

const tableBase = "w-full border-collapse text-[13px] sm:text-sm";
const th = "border-b border-border bg-muted/50 px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[11px] text-muted-foreground";
const td = "border-b border-border/50 px-3 py-2.5";

/* ─────────────── Subject bar (vertical, short labels) ─────────────── */
function subjectBarChart(responses: Response[], color = "hsl(231, 65%, 55%)") {
  const counts: Record<string, number> = {};
  responses.forEach((r) => { counts[r.subject] = (counts[r.subject] ?? 0) + 1; });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    data: [{
      type: "bar",
      x: entries.map(([s]) => shortSubject(s)),
      y: entries.map(([, n]) => n),
      text: entries.map(([, n]) => String(n)),
      textposition: "outside",
      hovertext: entries.map(([s, n]) => `${s}<br>${n} responses`),
      hoverinfo: "text",
      marker: { color },
    }] as Plotly.Data[],
    layout: {
      showlegend: false,
      xaxis: { title: "" },
      yaxis: { title: "Responses" },
      margin: { l: 40, r: 10, t: 18, b: 40 },
    },
  };
}

/* ─────────────── D-1 Hero with live previews ─────────────── */
function DashboardHero({ responses, jumpTo }: { responses: Response[]; jumpTo: (id: string) => void }) {
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

  const subjectBars = useMemo(() => subjectBarChart(responses, "hsl(188, 100%, 55%)"), [responses]);

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
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] backdrop-blur">
            Dashboard
          </span>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Visualization
          </span>
        </div>
        <h2 className="font-display text-2xl font-bold leading-[1.05] sm:text-3xl lg:text-4xl">
          Findings, visualized
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-white/80">
          Each visualization corresponds to a section of the results— tap a chart to jump straight to the analysis.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

  const chart = useMemo(() => subjectBarChart(responses), [responses]);

  return (
    <SectionWrap id="respondents" chapter="Chapter 3 · Results" eyebrow="Profile" title="Profile of the Respondents" variant={variant}>
      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        {[
          { k: "N", v: String(responses.length) },
          { k: "Sampling", v: "Purposive" },
          { k: "Population", v: "406 (excl. 4th yr)" },
          { k: "Span", v: "Y1–3 · multi-sem" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border bg-card px-4 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.k}</p>
            <p className="font-display text-base font-bold">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className={tableBase}>
            <thead><tr><th className={th}>Core IT Subject</th><th className={`${th} text-center`}>Code</th><th className={`${th} text-right`}>Responses</th></tr></thead>
            <tbody>
              {counts.map(([s, n]) => (
                <tr key={s}>
                  <td className={td}>{s}</td>
                  <td className={`${td} text-center font-mono text-xs text-muted-foreground`}>{shortSubject(s)}</td>
                  <td className={`${td} text-right font-mono`}>{n}</td>
                </tr>
              ))}
              <tr className="bg-muted/30 font-bold">
                <td className={td}>Total</td>
                <td className={td} />
                <td className={`${td} text-right font-mono`}>{responses.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Distribution by subject</p>
          <PlotlyChart data={chart.data} layout={chart.layout as any} height={240} />
        </div>
      </div>
      <p className="mt-3 text-xs italic text-muted-foreground">
        Responses reflect historical academic records across multiple semesters— not a single concurrent term.
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
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
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
          <PlotlyChart data={bars.data} layout={bars.layout as any} height={230} />
        </div>
      </div>
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
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
    <SectionWrap id="reliability" chapter="Chapter 3 · Results" eyebrow="Reliability" title="Reliability— Composite Behavioral Score (Intensity)" variant={variant}>
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
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
        <p className="text-sm leading-relaxed">
          <strong>α = 0.70</strong>— Acceptable internal consistency. The five items reliably measure a common construct: the intensity of active technical engagement during laboratory sessions.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-5 Correlation Summary (table-only) ─────────────── */
function CorrelationSummary({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const rows = useMemo(() => {
    const hours = responses.map((r) => r.hours);
    const intensity = responses.map((r) => r.intensity);
    const prelim = responses.map((r) => r.prelim);
    const mid = responses.map((r) => r.midterm);
    return [
      { i: "PR-1", iv: "Weekly Hours (Frequency)",    dv: "Preliminary Grade", r: pearson(hours, prelim),     p: 0.1610, sig: false, target: "correlation-pr1" },
      { i: "PR-2", iv: "Composite Score (Intensity)", dv: "Preliminary Grade", r: pearson(intensity, prelim), p: 0.0008, sig: true,  target: "correlation-pr2" },
      { i: "PR-3", iv: "Weekly Hours (Frequency)",    dv: "Midterm Grade",     r: pearson(hours, mid),        p: 0.0044, sig: true,  target: "correlation-pr3" },
      { i: "PR-4", iv: "Composite Score (Intensity)", dv: "Midterm Grade",     r: pearson(intensity, mid),    p: 0.00009,sig: true,  target: "correlation-pr4" },
    ];
  }, [responses]);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <SectionWrap id="correlation" chapter="Chapter 3 · Results" eyebrow="Correlation Analysis" title="Correlation Analysis— Summary (Pearson r)" variant={variant}>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        Four pairings test the association between each usage metric and each grading period. Each row links to its own deep-dive slide with the scatter plot and a plain-English read.
      </p>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className={tableBase}>
          <thead><tr>
            <th className={th}>#</th>
            <th className={th}>Independent</th>
            <th className={th}>Dependent</th>
            <th className={`${th} text-right`}>r</th>
            <th className={`${th} text-right`}>p</th>
            <th className={`${th} text-center`}>Sig?</th>
            <th className={`${th} text-center`}>Detail</th>
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
                <td className={`${td} text-center`}>
                  <button onClick={() => jump(r.target)} className="text-xs font-semibold text-accent hover:underline">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
          <p className="text-sm leading-relaxed">
            <strong>At Preliminary:</strong> only Intensity is significant. Active engagement leads early-term outcomes; presence alone does not.
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
          <p className="text-sm leading-relaxed">
            <strong>By Midterm:</strong> both metrics are significant; Intensity remains the stronger correlate.
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-5x Pearson deep-dive (one per pairing) ─────────────── */
function PearsonDeepDive({
  id, code, variant, title, xs, ys, xLabel, yLabel, r, p, sig, read,
}: {
  id: string; code: string; variant: "odd" | "even"; title: string;
  xs: number[]; ys: number[]; xLabel: string; yLabel: string;
  r: number; p: number; sig: boolean; read: string;
}) {
  const chart = useMemo(() => {
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys, name: "Students",
          marker: { color: "hsl(188, 100%, 42%)", size: 8, opacity: 0.8 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: {
            color: sig ? "hsl(231, 65%, 30%)" : "hsl(0, 0%, 50%)",
            width: 2.5,
            dash: sig ? "solid" : "dash",
          }, name: "Trend" },
      ] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: xLabel }, yaxis: { title: yLabel } },
    };
  }, [xs, ys, xLabel, yLabel, sig]);

  const strength =
    Math.abs(r) < 0.1 ? "negligible" :
    Math.abs(r) < 0.3 ? "weak" :
    Math.abs(r) < 0.5 ? "moderate" :
    Math.abs(r) < 0.7 ? "strong" : "very strong";

  return (
    <SectionWrap id={id} chapter="Chapter 3 · Results" eyebrow={`Correlation · ${code}`} title={title} variant={variant}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{xLabel} vs {yLabel}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sig ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
              {sig ? "Significant · α = 0.05" : "Not significant · α = 0.05"}
            </span>
          </div>
          <PlotlyChart data={chart.data} layout={chart.layout as any} height={260} />
          <p className="mt-2 text-[11px] text-muted-foreground">
            <span className="mr-3"><span className="mr-1 inline-block h-2 w-2 rounded-full align-middle" style={{ background: "hsl(188 100% 42%)" }} />Respondents</span>
            <span><span className="mr-1 inline-block h-[2px] w-3 align-middle" style={{ background: sig ? "hsl(231 65% 30%)" : "hsl(0 0% 50%)", borderTop: sig ? "none" : "1px dashed currentColor" }} />Trend ({sig ? "solid = significant" : "dashed = not significant"})</span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat k="r" v={r.toFixed(4)} hl={sig} />
            <Stat k="p" v={p < 0.0001 ? "<0.0001" : p.toFixed(4)} hl={sig} />
            <Stat k="α = 0.05" v={sig ? "Significant" : "Not Sig"} hl={sig} />
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What the chart shows</p>
            <p className="mt-2 text-sm leading-relaxed">
              The scatter plots each respondent's <em>{xLabel}</em> against their <em>{yLabel}</em>. The trend line slopes {r >= 0 ? "upward" : "downward"}— a {strength} {r >= 0 ? "positive" : "negative"} association ({sig ? "statistically significant" : "not statistically significant"}).
            </p>
          </div>
          <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Reading the result</p>
            <p className="mt-2 text-sm leading-relaxed">{read}</p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function Stat({ k, v, hl }: { k: string; v: string; hl?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${hl ? "border-accent bg-accent/5" : "bg-card"}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{k}</p>
      <p className={`mt-1 font-display text-base font-bold ${hl ? "text-accent" : ""}`}>{v}</p>
    </div>
  );
}

/* ─────────────── D-6a Regression— Model Summary ─────────────── */
function RegressionSummary({ responses, variant }: { responses: Response[]; variant: "odd" | "even" }) {
  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const rows = [
    { m: "A", p: "Weekly Hours only", r2: "0.0728", F: "6.5940", pv: "0.0120", s: true,  target: "regression-model-a" },
    { m: "B", p: "Composite Score only", r2: "0.0153", F: "1.3009", pv: "0.2573", s: false, target: "regression-model-b" },
    { m: "C", p: "Both (Combined)",    r2: "0.0733", F: "3.2847", pv: "0.0424", s: true,  target: "regression-model-c" },
  ];

  return (
    <SectionWrap id="regression" chapter="Chapter 3 · Results" eyebrow="Regression Analysis" title="Regression— Model Summary" variant={variant}>
      <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
        Three regression models test whether laboratory usage predicts the Performance Change Score. Each row links to its own deep-dive slide with the model's chart and statistics.
      </p>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className={tableBase}>
          <thead><tr>
            <th className={th}>Model</th><th className={th}>Predictor(s)</th>
            <th className={`${th} text-right`}>R²</th><th className={`${th} text-right`}>F</th>
            <th className={`${th} text-right`}>p</th><th className={`${th} text-center`}>Sig?</th>
            <th className={`${th} text-center`}>Detail</th>
          </tr></thead>
          <tbody>
            {rows.map((r) => (
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
                <td className={`${td} text-center`}>
                  <button onClick={() => jump(r.target)} className="text-xs font-semibold text-accent hover:underline">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
        <p className="text-sm leading-relaxed">
          Model C is statistically significant (p = 0.0424) and explains <strong>7.33%</strong> of variance in the Performance Change Score.
          <strong> H₀₁ is rejected:</strong> laboratory usage significantly predicts academic performance change.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-6x Regression deep-dive (one per model) ─────────────── */
function RegressionDeepDive({
  id, model, variant, title, xs, ys, xLabel, yLabel,
  R2, F, p, beta, betaP, formula, read, observedVsPredicted,
}: {
  id: string; model: string; variant: "odd" | "even"; title: string;
  xs: number[]; ys: number[]; xLabel: string; yLabel: string;
  R2: number; F: number; p: number; beta: number; betaP: number;
  formula: string; read: string; observedVsPredicted?: boolean;
}) {
  const chart = useMemo(() => {
    if (observedVsPredicted) {
      const min = Math.min(...xs, ...ys), max = Math.max(...xs, ...ys);
      return {
        data: [
          { type: "scatter", mode: "markers", x: xs, y: ys, name: "Students",
            marker: { color: "hsl(188, 100%, 42%)", size: 8, opacity: 0.75 } },
          { type: "scatter", mode: "lines", x: [min, max], y: [min, max],
            line: { color: "hsl(231, 65%, 30%)", width: 2, dash: "dash" }, name: "Perfect fit" },
        ] as Plotly.Data[],
        layout: { showlegend: false, xaxis: { title: xLabel }, yaxis: { title: yLabel } },
      };
    }
    const { slope, intercept } = linreg(xs, ys);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const sigLocal = p < 0.05;
    return {
      data: [
        { type: "scatter", mode: "markers", x: xs, y: ys,
          marker: { color: "hsl(188, 100%, 42%)", size: 8, opacity: 0.8 } },
        { type: "scatter", mode: "lines", x: [minX, maxX],
          y: [intercept + slope * minX, intercept + slope * maxX],
          line: {
            color: sigLocal ? "hsl(231, 65%, 30%)" : "hsl(0, 0%, 50%)",
            width: 2.5,
            dash: sigLocal ? "solid" : "dash",
          } },
      ] as Plotly.Data[],
      layout: { showlegend: false, xaxis: { title: xLabel }, yaxis: { title: yLabel } },
    };
  }, [xs, ys, xLabel, yLabel, p, observedVsPredicted]);

  const sig = p < 0.05;

  return (
    <SectionWrap id={id} chapter="Chapter 3 · Results" eyebrow={`Regression · Model ${model}`} title={title} variant={variant}>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{xLabel} vs {yLabel}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sig ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
              {sig ? "Significant · α = 0.05" : "Not significant · α = 0.05"}
            </span>
          </div>
          <PlotlyChart data={chart.data} layout={chart.layout as any} height={260} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            <Stat k="R²" v={R2.toFixed(4)} />
            <Stat k="F" v={F.toFixed(2)} />
            <Stat k="Model p" v={p.toFixed(4)} hl={sig} />
            <Stat k="β (key)" v={beta.toFixed(4)} hl={betaP < 0.05} />
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Predictive equation</p>
            <p className="mt-2 font-mono text-xs sm:text-[13px]">{formula}</p>
          </div>
          <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Reading the result</p>
            <p className="mt-2 text-sm leading-relaxed">{read}</p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-6c Regression Coefficients ─────────────── */
function RegressionCoefficients({ variant }: { variant: "odd" | "even" }) {
  return (
    <SectionWrap id="regression-coef" chapter="Chapter 3 · Results" eyebrow="Regression · Coefficients" title="Regression— Consolidated Coefficients" variant={variant}>
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
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3 text-sm leading-relaxed">
        <p>In the combined model: Frequency is significant (p = 0.0251). Intensity is not (p = 0.8238).</p>
        <p className="mt-2 font-mono text-xs sm:text-[13px]">
          Score = −0.9915 + (0.4339 × Weekly Hours) + (0.0271 × Composite Score)
        </p>
        <p className="mt-2">Every additional weekly lab hour predicts <strong>+0.43</strong> points of improvement between grading periods.</p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-7 Summary (9 findings) ─────────────── */
function SummaryFindings({ variant }: { variant: "odd" | "even" }) {
  const items = [
    { k: "01", tag: "Sample",         text: "86 valid BSIT respondents at STI College Malolos with complete paired Preliminary and Midterm grades for selected core IT subjects." },
    { k: "02", tag: "Usage profile",  text: "Mean weekly laboratory hours = 4.31; mean Composite Behavioral Score = 16.23." },
    { k: "03", tag: "Grade movement", text: "Preliminary 87.32 → Midterm 88.64 (Performance Change Score = +1.30)— a slight average gain." },
    { k: "04", tag: "Reliability",    text: "Cronbach's α = 0.70— acceptable internal consistency for the Composite Behavioral Score." },
    { k: "05", tag: "Pearson r",      text: "Intensity (Composite Score) is significantly related to both Preliminary and Midterm grades." },
    { k: "06", tag: "Pearson r",      text: "Frequency (Weekly Hours) is not significant at Preliminary, but becomes significant at Midterm." },
    { k: "07", tag: "Regression",     text: "In the multiple model, Frequency is the only statistically significant individual predictor of Performance Change Score." },
    { k: "08", tag: "Model fit",      text: "The multiple regression model is statistically significant (p = 0.0424)— the Null Hypothesis is rejected." },
    { k: "09", tag: "Variance",       text: "R² = 0.0733— laboratory usage explains 7.33% of the variance in performance change; most variation comes from factors outside the model." },
  ];
  return (
    <SectionWrap id="summary" chapter="Chapter 3 · Results" eyebrow="Summary of Findings" title="Summary of Findings" variant={variant}>
      <ol className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.k} className="rounded-xl border bg-card p-3.5 shadow-soft">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-2xl font-bold text-muted-foreground/30">{it.k}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">{it.tag}</span>
            </div>
            <p className="mt-1 text-[12px] leading-snug">{it.text}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] italic leading-relaxed text-muted-foreground">
        Overall: Intensity tracks absolute grades, while Frequency drives the change between them— laboratory usage is associated with academic performance among the BSIT respondents.
      </p>
    </SectionWrap>
  );
}

/* ─────────────── D-8 Usage vs Grades ─────────────── */
function UsageGrades({ variant }: { variant: "odd" | "even" }) {
  const Col = ({ title, items, interp }: { title: string; items: { k: string; v: string; sig: boolean }[]; interp: string }) => (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((i) => (
          <li key={i.k} className="flex items-start justify-between gap-3 border-b border-border/50 pb-2 last:border-0">
            <span className="text-sm font-semibold">{i.k}</span>
            <span className={`text-right font-mono text-sm ${i.sig ? "text-accent" : "text-muted-foreground"}`}>{i.v}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">{interp}</p>
    </div>
  );
  return (
    <SectionWrap id="usage-grades" chapter="Chapter 4 · Discussion" eyebrow="Relationship Between Usage Metrics and Absolute Grades" title="Usage Metrics and Absolute Grades" variant={variant}>
      <div className="grid gap-3 md:grid-cols-2">
        <Col title="Preliminary Period"
          items={[
            { k: "Frequency", v: "r = 0.15, p = 0.161 (NS)", sig: false },
            { k: "Intensity", v: "r = 0.36, p = 0.001 (Sig)", sig: true },
          ]}
          interp="Initial standing is tied to quality of engagement, not quantity of time." />
        <Col title="Midterm Period"
          items={[
            { k: "Frequency", v: "r = 0.30, p = 0.004 (Sig)", sig: true },
            { k: "Intensity", v: "r = 0.41, p < 0.001 (Sig)", sig: true },
          ]}
          interp="By Midterm, consistent attendance is measurable— but engagement depth still leads." />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Why Intensity leads at Preliminary</p>
          <p className="mt-1 text-[13px] leading-relaxed">
            A selection effect: students who actively code and debug usually arrive with stronger prior preparation. Their early grades reflect existing skill, not new learning. This echoes <em>Vahid et al. (2023)</em>— consistent technical engagement maps to higher achievement.
          </p>
        </div>
        <div className="rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Why Frequency catches up by Midterm</p>
          <p className="mt-1 text-[13px] leading-relaxed">
            Exposure accumulates. Even less-engaged students who keep showing up enter enough practice cycles to translate hours into grade gains, aligning with <em>Limniou (2021)</em> on structured ICT exposure.
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-9 Predictors ─────────────── */
function Predictors({ variant }: { variant: "odd" | "even" }) {
  const stats = [
    { k: "H₀₁ Status", v: "REJECTED", sub: "p = 0.0424", hl: true },
    { k: "Mean Δ", v: "+1.30", sub: "range −13 to +13" },
    { k: "R²", v: "0.0733", sub: "7.33% variance" },
    { k: "Frequency", v: "Significant", sub: "p = 0.0251 · B = 0.4339", hl: true },
    { k: "Intensity", v: "Not Sig", sub: "p = 0.8238 (combined)" },
  ];
  return (
    <SectionWrap id="predictors" chapter="Chapter 4 · Discussion" eyebrow="Predictors of Academic Performance Change" title="Predictors of Performance Change" variant={variant}>
      <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.k} className={`rounded-xl border p-3 ${s.hl ? "border-accent bg-accent/5" : "bg-card"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.k}</p>
            <p className={`mt-1 font-display text-base font-bold ${s.hl ? "text-accent" : ""}`}>{s.v}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What β = 0.43 means</p>
          <p className="mt-2 text-[13px] leading-relaxed">
            Each additional hour per week in the lab is associated with about <strong>+0.43 grade points</strong> of improvement between Preliminary and Midterm.
          </p>
          <p className="mt-2 rounded-lg bg-muted/40 p-2 font-mono text-[11px]">
            Worked example · 4 hrs → 7 hrs ⇒ predicted Δ ≈ +1.30
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">What it doesn't mean</p>
          <ul className="mt-2 space-y-1 text-[13px] leading-relaxed">
            <li>• R² = 7.33% ⇒ <strong>92.67% of variance</strong> in Δ is unexplained by lab usage alone (study habits, prior knowledge, instruction quality, etc.).</li>
            <li>• Correlational design— adding hours does not cause higher grades; both move together.</li>
            <li>• Sampling spans Years 1–3 across multiple semesters; the effect is a general pattern, not a single cohort's trajectory.</li>
          </ul>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-10a Divergence— main ─────────────── */
function DivergenceMain({ variant }: { variant: "odd" | "even" }) {
  const Pair = ({ title, role, body }: { title: string; role: string; body: string }) => (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-2 text-sm font-semibold">Role: {role}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
  return (
    <SectionWrap id="divergence" chapter="Chapter 4 · Discussion" eyebrow="Interpretation of Divergent Findings" title="A Discovery: Intensity vs Frequency" variant={variant}>
      <p className="mb-3 max-w-3xl text-sm italic leading-relaxed text-muted-foreground">
        The study expected both dimensions to contribute to performance improvement. The data revealed that they serve different functions.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <Pair title="Intensity" role="Strongest correlate of absolute grade level"
          body="Tracks students who already perform well— likely existing skill or engagement habits rather than growth. High-prior-ability students sit near the grade ceiling, leaving Intensity little room to predict change." />
        <Pair title="Frequency" role="Sole significant predictor of performance change"
          body="Consistent attendance creates repeated contact with course material across all skill levels. The accumulation of hours provides the environment where learning cycles can occur— improvement becomes measurable regardless of prior ability or engagement style." />
      </div>
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Why the divergence makes sense</p>
        <p className="mt-1 text-[13px] leading-relaxed">
          <strong>Intensity ↔ Constructivist Learning</strong> (Piaget · Vygotsky): active coding and debugging are how knowledge is constructed, so engagement quality predicts the resulting <em>level</em> of competency.
          <strong> Frequency ↔ Experiential Learning</strong> (Kolb): repeated lab visits provide more iterations of the experience cycle, so attendance predicts <em>change</em> in competency over time.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-10b Divergence— context ─────────────── */
function DivergenceContext({ variant }: { variant: "odd" | "even" }) {
  const cards = [
    {
      t: "Sampling Span",
      b: "Respondent data spans Year 1 through Year 3 subjects across multiple previous semesters. The mixed distribution means the predictive strength of Frequency reflects a general trend across the BSIT curriculum rather than a finding from one academic level."
    },
    {
      t: "Data Preparation Note",
      b: "One outlier in Frequency (20 reported weekly hours) was Winsorized to 10 hours— the nearest non-outlier value— prior to regression to prevent distortion of the predictive model."
    },
    {
      t: "Self-Report Limitation",
      b: "Both Frequency and Intensity are self-reported. Recall bias and social-desirability bias may inflate engagement scores; objective attendance logs and instructor ratings would strengthen the design."
    },
    {
      t: "Cross-Sectional Pairing",
      b: "Performance Δ uses Prelim/Midterm pairs from possibly different semesters per respondent. The finding describes a general intra-term pattern across the BSIT curriculum, not a single longitudinal trajectory."
    },
  ];
  return (
    <SectionWrap id="divergence-ctx" chapter="Chapter 4 · Discussion" eyebrow="Interpretation of Divergent Findings" title="Contextual Considerations" variant={variant}>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((c) => (
          <div key={c.t} className="rounded-2xl border bg-card p-4 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{c.t}</p>
            <p className="mt-2 text-[13px] leading-relaxed">{c.b}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-11a Synthesis with Theory ─────────────── */
function SynthesisTheory({ variant }: { variant: "odd" | "even" }) {
  return (
    <SectionWrap id="synthesis" chapter="Chapter 4 · Discussion" eyebrow="Synthesis with Theoretical Framework" title="Synthesis with Theoretical Framework" variant={variant}>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { name: "Experiential Learning", who: "Kolb (1984)", body: "Accounts for Frequency as the predictor of change— repeated laboratory attendance provides the iterative experience cycle through which skills are built." },
          { name: "Cognitive Load Theory", who: "Sweller (1988)", body: "Explains why consistent access matters— regular attendance reduces logistical friction and reallocates cognitive effort toward learning." },
          { name: "Constructivist Learning", who: "Piaget · Vygotsky", body: "Explains why Intensity correlates with absolute grade standing— active technical engagement is the mechanism of knowledge construction." },
        ].map((t) => (
          <div key={t.name} className="rounded-2xl border bg-card p-5 shadow-soft">
            <p className="font-display text-base font-bold">{t.name}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.who}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{t.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl border-l-4 border-l-accent bg-accent/5 p-3">
        <p className="text-sm leading-relaxed">
          <strong>Frequency is the condition for improvement. Intensity is the condition for high performance.</strong> The findings align with all three frameworks.
        </p>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-11b Convergence with Literature ─────────────── */
function ConvergenceLit({ variant }: { variant: "odd" | "even" }) {
  return (
    <SectionWrap id="convergence" chapter="Chapter 4 · Discussion" eyebrow="Synthesis with Related Literature" title="Convergence with Related Literature" variant={variant}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Frequency → Performance Change</p>
          <p className="mt-2 text-sm font-semibold">Vahid et al. (2023)</p>
          <p className="mt-1 text-[13px] leading-relaxed">
            Found that students who consistently engaged in coding activities achieved higher grades. Our finding that consistent laboratory exposure predicts performance change directly aligns.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Intensity → Grade Standing</p>
          <p className="mt-2 text-sm font-semibold">Canoy et al. (2023) · Cadiz-Gabejan & Takenaka (2021)</p>
          <p className="mt-1 text-[13px] leading-relaxed">
            Found that structured, active engagement and existing computer literacy support stronger academic standing— echoing our finding that Intensity correlates most strongly with absolute grades.
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-11c Extension of prior work ─────────────── */
function ExtensionWork({ variant }: { variant: "odd" | "even" }) {
  return (
    <SectionWrap id="extension" chapter="Chapter 4 · Discussion" eyebrow="Synthesis with Related Literature" title="Where This Study Extends Prior Work" variant={variant}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Two-Dimensional Construct</p>
          <p className="mt-2 text-[13px] leading-relaxed">
            Prior studies treat laboratory usage as a single construct. This study separates Frequency (time) from Intensity (depth of engagement) and shows they serve <strong>different functions</strong> in academic outcomes.
          </p>
        </div>
        <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Intra-Term Performance Shift</p>
          <p className="mt-2 text-[13px] leading-relaxed">
            No reviewed study examines the change between Preliminary and Midterm grades as the dependent variable. Identifying Frequency as that change-predictor is a <strong>new contribution</strong>.
          </p>
        </div>
      </div>
    </SectionWrap>
  );
}

/* ─────────────── D-12a Implications ─────────────── */
function ImplicationsSummary({ variant }: { variant: "odd" | "even" }) {
  const summary = [
    "Consistent laboratory attendance is the primary institutional lever for improving student academic performance across a term.",
    "High engagement quality (Intensity) is associated with high grade achievement but does not drive improvement on its own.",
    "Policies focused solely on enhancing engagement quality without ensuring access frequency will not fully address performance development.",
  ];
  return (
    <SectionWrap id="implications" chapter="Chapter 4 · Discussion" eyebrow="Implications and Significance" title="Implications and Significance" variant={variant}>
      <ol className="grid gap-3 md:grid-cols-3">
        {summary.map((s, i) => (
          <li key={i} className="rounded-2xl border bg-card p-5 shadow-soft">
            <span className="font-display text-3xl font-bold text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1 text-[13px] leading-relaxed">{s}</p>
          </li>
        ))}
      </ol>
    </SectionWrap>
  );
}

/* ─────────────── D-12b Recommendations by audience ─────────────── */
function RecommendationsByAudience({ variant }: { variant: "odd" | "even" }) {
  const recs = [
    { who: "Institution (STI College Malolos)", what: "Ensure consistent scheduling and availability of computer laboratory sessions, particularly for foundational subjects. Review laboratory allocation systems to minimize access barriers across the academic term." },
    { who: "Instructors", what: "Design laboratory activities that build progressively across the term. Prioritize consistent attendance expectations alongside the quality of engagement during sessions." },
    { who: "Students", what: "Maintain consistent laboratory attendance. Pair regular attendance with active technical engagement— both dimensions contribute to overall learning outcomes." },
    { who: "Future Researchers", what: "Examine additional predictors of performance change such as prior knowledge, study habits, and instructional quality. Extend scope to 4th-year students. Test whether the Frequency–Intensity divergence pattern holds in other academic disciplines." },
  ];
  return (
    <SectionWrap id="recommendations" chapter="Chapter 4 · Discussion" eyebrow="Recommendations" title="Recommendations" variant={variant}>
      <div className="grid gap-3 md:grid-cols-2">
        {recs.map((r) => (
          <div key={r.who} className="rounded-2xl border bg-card p-5 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{r.who}</p>
            <p className="mt-2 text-[13px] leading-relaxed">{r.what}</p>
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}
