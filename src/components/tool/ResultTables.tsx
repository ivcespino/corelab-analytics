import { describe, fmt, fmtP } from "@/lib/stats";
import type {
  CronbachResult,
  PearsonResult,
  RegressionResult,
} from "@/lib/stats";
import { StatTooltip } from "@/components/StatTooltip";
import { GLOSSARY } from "@/lib/glossary";

interface DescTableProps {
  variables: string[];
  columns: Record<string, number[]>;
}

export function DescriptiveTable({ variables, columns }: DescTableProps) {
  const rows = variables
    .filter((v) => columns[v])
    .map((v) => describe(v, columns[v].filter((x) => Number.isFinite(x))));
  if (rows.length === 0) return null;
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/60 px-5 py-3">
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Descriptive Statistics
        </h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-2.5 text-left">Variable</th>
              <th className="px-5 py-2.5 text-right"><HdrTip k="n">N</HdrTip></th>
              <th className="px-5 py-2.5 text-right">Mean</th>
              <th className="px-5 py-2.5 text-right"><HdrTip k="se" title="SD" body="Standard deviation — typical distance of values from the mean.">SD</HdrTip></th>
              <th className="px-5 py-2.5 text-right">Min</th>
              <th className="px-5 py-2.5 text-right">Max</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.variable} className="border-t border-border/40">
                <td className="px-5 py-2.5 font-medium">{r.variable}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{r.n}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{fmt(r.mean, 3)}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{fmt(r.sd, 3)}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{fmt(r.min, 3)}</td>
                <td className="px-5 py-2.5 text-right tabular-nums">{fmt(r.max, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CronbachTable({ result }: { result: CronbachResult }) {
  const interp =
    result.alpha >= 0.9 ? "Excellent" :
    result.alpha >= 0.8 ? "Good" :
    result.alpha >= 0.7 ? "Acceptable" :
    result.alpha >= 0.6 ? "Questionable" :
    result.alpha >= 0.5 ? "Poor" : "Unacceptable";
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/60 px-5 py-3">
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Reliability — Cronbach's α
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border/40 sm:grid-cols-3 lg:grid-cols-5">
        <Cell label={<HdrTip k="cronbach">Cronbach's α</HdrTip>} value={fmt(result.alpha, 4)} accent />
        <Cell label={<HdrTip k="k">Items (k)</HdrTip>} value={String(result.k)} />
        <Cell label={<HdrTip k="n">Respondents (N)</HdrTip>} value={String(result.n)} />
        <Cell
          label={<HdrTip k="ci">{`${(result.confidence * 100).toFixed(0)}% CI`}</HdrTip>}
          value={
            Number.isFinite(result.ciLower)
              ? `[${fmt(result.ciLower, 3)}, ${fmt(result.ciUpper, 3)}]`
              : "—"
          }
        />
        <Cell label="Interpretation" value={interp} />
      </div>
    </div>
  );
}

export function PearsonTable({ result, x, y }: { result: PearsonResult; x: string; y: string }) {
  const strength =
    Math.abs(result.r) >= 0.7 ? "Strong" :
    Math.abs(result.r) >= 0.4 ? "Moderate" :
    Math.abs(result.r) >= 0.2 ? "Weak" : "Very weak";
  const direction = result.r >= 0 ? "Positive" : "Negative";
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/60 px-5 py-3">
        <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Correlation — {x} × {y}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border/40 sm:grid-cols-3 lg:grid-cols-6">
        <Cell label={<HdrTip k="r">Pearson r</HdrTip>} value={fmt(result.r, 4)} accent />
        <Cell label={<HdrTip k="tStat">t-stat</HdrTip>} value={fmt(result.tStat, 3)} />
        <Cell label={<HdrTip k="df">df</HdrTip>} value={String(result.df)} />
        <Cell label={<HdrTip k="pValue">p-value</HdrTip>} value={fmtP(result.pValue)} />
        <Cell
          label={<HdrTip k="ci">{`${(result.confidence * 100).toFixed(0)}% CI for r`}</HdrTip>}
          value={
            Number.isFinite(result.ciLower)
              ? `[${fmt(result.ciLower, 3)}, ${fmt(result.ciUpper, 3)}]`
              : "—"
          }
        />
        <Cell label="Direction · Strength" value={`${direction} · ${strength}`} />
      </div>
    </div>
  );
}

export function RegressionTable({ result }: { result: RegressionResult }) {
  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden">
        <div className="border-b border-border/60 px-5 py-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Regression — Model Summary
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border/40 sm:grid-cols-5">
          <Cell label={<HdrTip k="rSquared">R²</HdrTip>} value={fmt(result.rSquared, 4)} accent />
          <Cell label={<HdrTip k="adjRSquared">Adj. R²</HdrTip>} value={fmt(result.adjustedRSquared, 4)} />
          <Cell label={<HdrTip k="fStat">F-statistic</HdrTip>} value={fmt(result.fStatistic, 3)} />
          <Cell label={<HdrTip k="pValue">Significance F</HdrTip>} value={fmtP(result.fPValue)} />
          <Cell label={<HdrTip k="n">N</HdrTip>} value={String(result.n)} />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-border/60 px-5 py-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Coefficients — predicting {result.response}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5 text-left">Term</th>
                <th className="px-5 py-2.5 text-right"><HdrTip k="b">B</HdrTip></th>
                <th className="px-5 py-2.5 text-right"><HdrTip k="se">SE</HdrTip></th>
                <th className="px-5 py-2.5 text-right"><HdrTip k="tStat">t</HdrTip></th>
                <th className="px-5 py-2.5 text-right"><HdrTip k="pValue">p</HdrTip></th>
                <th className="px-5 py-2.5 text-right whitespace-nowrap">
                  <HdrTip k="ci">{(result.confidence * 100).toFixed(0)}% CI</HdrTip>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.coefficients.map((c) => (
                <tr key={c.name} className="border-t border-border/40">
                  <td className="px-5 py-2.5 font-medium">{c.name}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{fmt(c.b, 4)}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{fmt(c.se, 4)}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{fmt(c.tStat, 3)}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{fmtP(c.pValue)}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums whitespace-nowrap">
                    [{fmt(c.ciLower, 3)}, {fmt(c.ciUpper, 3)}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.vif && Object.keys(result.vif).length > 0 && (
        <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            <HdrTip k="vif">Multicollinearity (VIF)</HdrTip>:{" "}
          </span>
          {Object.entries(result.vif)
            .map(([k, v]) => `${k} = ${fmt(v, 2)}${v > 5 ? " ⚠" : ""}`)
            .join(" · ")}
          {Object.values(result.vif).some((v) => v > 5) && (
            <span className="ml-2 text-destructive">VIF &gt; 5 suggests predictors are highly correlated.</span>
          )}
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, accent }: { label: React.ReactNode; value: string; accent?: boolean }) {
  return (
    <div className="bg-card px-5 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1 font-display text-xl font-bold tabular-nums " +
          (accent ? "text-accent" : "text-foreground")
        }
      >
        {value}
      </div>
    </div>
  );
}

function HdrTip({
  k,
  title,
  body,
  children,
}: {
  k: keyof typeof GLOSSARY;
  title?: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <StatTooltip termKey={k} title={title} body={body}>
      <span>{children}</span>
    </StatTooltip>
  );
}
