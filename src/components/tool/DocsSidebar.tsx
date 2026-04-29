import { Database, FunctionSquare, LineChart, Sparkles, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Raw CSV String",
    body: "Pasted text or uploaded file is read into memory as a single UTF-8 string.",
    code: 'name,score\\nAlice,82\\nBob,75',
  },
  {
    icon: FunctionSquare,
    title: "Array of Objects",
    body: "PapaParse tokenizes the string, infers headers, and produces row objects keyed by column.",
    code: '[{ name: "Alice", score: 82 }, …]',
  },
  {
    icon: Sparkles,
    title: "Statistical Formula",
    body: "Selected numeric columns feed the chosen estimator: α = (k/(k−1))(1 − Σσᵢ²/σ_T²), or OLS β = (XᵀX)⁻¹Xᵀy.",
    code: "β̂ = (XᵀX)⁻¹Xᵀy",
  },
  {
    icon: LineChart,
    title: "Plotly Coordinate Map",
    body: "Predictions and observed values become {x, y} traces rendered as an interactive scatter with trend line.",
    code: "trace = { x:[…], y:[…], mode:'markers' }",
  },
];

export function DocsSidebar() {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 text-accent">
          <BookOpen className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
            Data Pipeline
          </span>
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight">
          From CSV to Insight
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          How CoreLab transforms your spreadsheet into a publishable result, in four stages.
        </p>

        <ol className="mt-6 space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="relative pl-10">
              <span className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
                <s.icon className="h-3.5 w-3.5" />
              </span>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Step {i + 1}
              </div>
              <h4 className="font-display text-sm font-semibold">{s.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-foreground">
                {s.code}
              </pre>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
