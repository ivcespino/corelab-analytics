import { useRef, useState } from "react";
import type * as PlotlyType from "plotly.js";
import { Upload, Play, FileSpreadsheet, Sparkles, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { parseCsv, type ParsedDataset } from "@/lib/csv";
import {
  cronbachAlpha,
  pearson,
  linearRegression,
  fmt,
  fmtP,
  type CronbachResult,
  type PearsonResult,
  type RegressionResult,
} from "@/lib/stats";
import {
  DescriptiveTable,
  CronbachTable,
  PearsonTable,
  RegressionTable,
} from "@/components/tool/ResultTables";
import { PlotlyChart } from "@/components/tool/PlotlyChart";
import { DocsSidebar } from "@/components/tool/DocsSidebar";

type Method = "cronbach" | "pearson" | "regression";

const SAMPLE_CSV = `participant,item1,item2,item3,item4,study_hours,exam_score
1,4,5,4,5,12,88
2,3,3,4,3,5,72
3,5,5,5,4,15,94
4,2,3,2,3,3,65
5,4,4,5,4,10,84
6,3,4,3,4,8,78
7,5,4,5,5,14,91
8,2,2,3,2,2,60
9,4,5,4,4,11,86
10,3,3,4,4,7,75
11,5,5,4,5,16,96
12,2,3,3,3,4,68`;

interface Results {
  variables: string[];
  cronbach?: CronbachResult;
  pearson?: { result: PearsonResult; x: string; y: string };
  regression?: RegressionResult;
  plot?: { data: Plotly.Data[]; layout?: Partial<Plotly.Layout> };
  interpretation: string;
}

export default function Tool() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [dataset, setDataset] = useState<ParsedDataset | null>(() =>
    parseCsv(SAMPLE_CSV),
  );
  const [method, setMethod] = useState<Method>("regression");
  const [selectedItems, setSelectedItems] = useState<string[]>([
    "item1",
    "item2",
    "item3",
    "item4",
  ]);
  const [pearsonX, setPearsonX] = useState("study_hours");
  const [pearsonY, setPearsonY] = useState("exam_score");
  const [regResponse, setRegResponse] = useState("exam_score");
  const [regPredictors, setRegPredictors] = useState<string[]>(["study_hours"]);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const numericHeaders = dataset?.numericHeaders ?? [];

  const handleParse = () => {
    try {
      const ds = parseCsv(csvText);
      if (ds.headers.length === 0) throw new Error("No headers detected");
      setDataset(ds);
      setError(null);
      setResults(null);
      toast({
        title: "Data parsed",
        description: `${ds.rows.length} rows · ${ds.headers.length} columns (${ds.numericHeaders.length} numeric)`,
      });
    } catch (e: any) {
      setError(e.message ?? "Failed to parse CSV");
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result ?? "");
      setCsvText(text);
      try {
        const ds = parseCsv(text);
        setDataset(ds);
        setError(null);
        setResults(null);
        toast({ title: "File loaded", description: file.name });
      } catch (err: any) {
        setError(err.message);
      }
    };
    reader.readAsText(file);
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, key: string) => {
    setArr(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);
  };

  const runAnalysis = () => {
    if (!dataset) {
      setError("Please load data first");
      return;
    }
    setError(null);
    try {
      if (method === "cronbach") {
        if (selectedItems.length < 2) throw new Error("Select at least 2 items");
        const cols = selectedItems.map((k) => dataset.columns[k]);
        const result = cronbachAlpha(cols);
        const itemMeans = selectedItems.map(
          (k, i) =>
            result.itemVariances[i] !== undefined
              ? cols[i]
                  .filter((v) => Number.isFinite(v))
                  .reduce((a, b) => a + b, 0) /
                cols[i].filter((v) => Number.isFinite(v)).length
              : 0,
        );
        const plot: Results["plot"] = {
          data: [
            {
              type: "bar",
              x: selectedItems,
              y: itemMeans,
              marker: { color: "hsl(188, 100%, 42%)" },
              name: "Item mean",
            },
          ],
          layout: {
            yaxis: { title: { text: "Mean response" } },
            xaxis: { title: { text: "Item" } },
          },
        };
        setResults({
          variables: selectedItems,
          cronbach: result,
          plot,
          interpretation: buildCronbachInterp(result),
        });
      } else if (method === "pearson") {
        if (!pearsonX || !pearsonY || pearsonX === pearsonY)
          throw new Error("Select two distinct variables");
        const xs = dataset.columns[pearsonX];
        const ys = dataset.columns[pearsonY];
        const result = pearson(xs, ys);
        const trend = trendLine(xs, ys);
        const plot: Results["plot"] = {
          data: [
            {
              type: "scatter",
              mode: "markers",
              x: xs,
              y: ys,
              marker: { color: "hsl(188, 100%, 42%)", size: 9 },
              name: "Observations",
            },
            {
              type: "scatter",
              mode: "lines",
              x: trend.x,
              y: trend.y,
              line: { color: "hsl(231, 65%, 30%)", width: 2 },
              name: "Trend",
            },
          ],
          layout: {
            xaxis: { title: { text: pearsonX } },
            yaxis: { title: { text: pearsonY } },
          },
        };
        setResults({
          variables: [pearsonX, pearsonY],
          pearson: { result, x: pearsonX, y: pearsonY },
          plot,
          interpretation: buildPearsonInterp(result, pearsonX, pearsonY),
        });
      } else {
        if (regPredictors.length === 0)
          throw new Error("Select at least one predictor");
        if (regPredictors.includes(regResponse))
          throw new Error("Response cannot also be a predictor");
        const xCols = regPredictors.map((k) => dataset.columns[k]);
        const y = dataset.columns[regResponse];
        const result = linearRegression(xCols, y, regPredictors, regResponse);
        const plot: Results["plot"] = {
          data: [
            {
              type: "scatter",
              mode: "markers",
              x: result.predicted,
              y: Array.from({ length: result.predicted.length }, (_, i) =>
                result.predicted[i] + result.residuals[i],
              ),
              marker: { color: "hsl(188, 100%, 42%)", size: 9 },
              name: "Observed vs predicted",
            },
            {
              type: "scatter",
              mode: "lines",
              x: [Math.min(...result.predicted), Math.max(...result.predicted)],
              y: [Math.min(...result.predicted), Math.max(...result.predicted)],
              line: { color: "hsl(231, 65%, 30%)", width: 2, dash: "dash" },
              name: "Perfect fit",
            },
          ],
          layout: {
            xaxis: { title: { text: `Predicted ${regResponse}` } },
            yaxis: { title: { text: `Observed ${regResponse}` } },
          },
        };
        setResults({
          variables: [regResponse, ...regPredictors],
          regression: result,
          plot,
          interpretation: buildRegressionInterp(result),
        });
      }
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (e: any) {
      setError(e.message ?? "Analysis failed");
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Hero */}
          <div className="mb-12 max-w-3xl">
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Statistical Analysis Tool
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Run rigorous tests on your survey data — in seconds.
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Paste a CSV or upload a file, choose a method, and CoreLab returns the
              same descriptive table, statistical grid, and visualization you'd find in a
              published methodology section.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8">
              {/* Data input */}
              <section className="glass-card p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">1. Load your data</h2>
                  {dataset && (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {dataset.rows.length} rows · {dataset.numericHeaders.length} numeric cols
                    </span>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <Label htmlFor="csv">Paste CSV</Label>
                  <Textarea
                    id="csv"
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    rows={8}
                    className="font-mono text-xs"
                    placeholder="name,score&#10;Alice,82"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={handleParse} variant="default">
                      <FileSpreadsheet className="h-4 w-4" /> Parse CSV
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" /> Upload File
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] && handleFile(e.target.files[0])
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Method + variable selection */}
              <section className="glass-card p-6 sm:p-7">
                <h2 className="font-display text-xl font-bold">
                  2. Choose method & variables
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Statistical method</Label>
                    <Select
                      value={method}
                      onValueChange={(v) => {
                        setMethod(v as Method);
                        setResults(null);
                      }}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cronbach">Cronbach's Alpha (Reliability)</SelectItem>
                        <SelectItem value="pearson">Pearson R (Correlation)</SelectItem>
                        <SelectItem value="regression">
                          Linear Regression (Simple / Multiple)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={runAnalysis} className="w-full" size="lg">
                      <Play className="h-4 w-4" /> Run Analysis
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  {method === "cronbach" && (
                    <VariableChecklist
                      label="Select scale items (≥ 2)"
                      headers={numericHeaders}
                      selected={selectedItems}
                      onToggle={(k) => toggle(selectedItems, setSelectedItems, k)}
                    />
                  )}
                  {method === "pearson" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Variable X</Label>
                        <Select value={pearsonX} onValueChange={setPearsonX}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Variable Y</Label>
                        <Select value={pearsonY} onValueChange={setPearsonY}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                  {method === "regression" && (
                    <div className="space-y-5">
                      <div>
                        <Label>Response (Y)</Label>
                        <Select value={regResponse} onValueChange={setRegResponse}>
                          <SelectTrigger className="mt-1.5 sm:max-w-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <VariableChecklist
                        label="Predictors (X) — pick 1 for simple, 2+ for multiple"
                        headers={numericHeaders.filter((h) => h !== regResponse)}
                        selected={regPredictors}
                        onToggle={(k) => toggle(regPredictors, setRegPredictors, k)}
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-5 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </section>

              {/* Results */}
              <div ref={resultsRef}>
                {results && dataset && (
                  <section className="space-y-6">
                    <div>
                      <span className="section-eyebrow">Standardized Report</span>
                      <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                        3. Results
                      </h2>
                    </div>

                    <DescriptiveTable
                      variables={results.variables}
                      columns={dataset.columns}
                    />

                    {results.cronbach && <CronbachTable result={results.cronbach} />}
                    {results.pearson && (
                      <PearsonTable
                        result={results.pearson.result}
                        x={results.pearson.x}
                        y={results.pearson.y}
                      />
                    )}
                    {results.regression && (
                      <RegressionTable result={results.regression} />
                    )}

                    {results.plot && (
                      <div className="glass-card p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Visualization
                          </h4>
                        </div>
                        <PlotlyChart
                          data={results.plot.data}
                          layout={results.plot.layout}
                        />
                      </div>
                    )}

                    <div className="glass-card p-6">
                      <div className="flex items-center gap-2 text-accent">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                          AI Interpretation
                        </span>
                      </div>
                      <h4 className="mt-1 font-display text-lg font-bold">
                        Generated narrative summary
                      </h4>
                      <Textarea
                        readOnly
                        value={results.interpretation}
                        rows={6}
                        className="mt-3 resize-none bg-muted/30 text-sm leading-relaxed"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Placeholder — will be replaced by an LLM-generated report once
                        AI is wired in.
                      </p>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <DocsSidebar />
          </div>
        </div>
      </main>
    </>
  );
}

function VariableChecklist({
  label,
  headers,
  selected,
  onToggle,
}: {
  label: string;
  headers: string[];
  selected: string[];
  onToggle: (k: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {headers.map((h) => (
          <label
            key={h}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <Checkbox
              checked={selected.includes(h)}
              onCheckedChange={() => onToggle(h)}
            />
            <span className="font-medium">{h}</span>
          </label>
        ))}
        {headers.length === 0 && (
          <p className="text-sm text-muted-foreground">No numeric columns available.</p>
        )}
      </div>
    </div>
  );
}

// ───────── helpers ─────────
function trendLine(x: number[], y: number[]): { x: number[]; y: number[] } {
  const valid = x.map((v, i) => [v, y[i]]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
  if (valid.length < 2) return { x: [], y: [] };
  const xs = valid.map((v) => v[0]);
  const ys = valid.map((v) => v[1]);
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0, den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return { x: [minX, maxX], y: [intercept + slope * minX, intercept + slope * maxX] };
}

function buildCronbachInterp(r: CronbachResult): string {
  const verdict =
    r.alpha >= 0.9 ? "excellent internal consistency" :
    r.alpha >= 0.8 ? "good internal consistency" :
    r.alpha >= 0.7 ? "acceptable internal consistency" :
    r.alpha >= 0.6 ? "questionable internal consistency" :
    "poor internal consistency";
  return `Cronbach's α = ${fmt(r.alpha, 3)} across ${r.k} items and ${r.n} respondents indicates ${verdict}. Conventionally, α ≥ 0.70 is considered the minimum threshold for reliability in research instruments. ${r.alpha >= 0.7 ? "The scale appears reliable for further analysis." : "Consider revising or removing low-performing items to improve reliability."}`;
}

function buildPearsonInterp(r: PearsonResult, x: string, y: string): string {
  const sig = r.pValue < 0.05 ? "statistically significant" : "not statistically significant";
  const dir = r.r >= 0 ? "positive" : "negative";
  const strength =
    Math.abs(r.r) >= 0.7 ? "strong" :
    Math.abs(r.r) >= 0.4 ? "moderate" :
    Math.abs(r.r) >= 0.2 ? "weak" : "very weak";
  return `A Pearson correlation between ${x} and ${y} (N = ${r.n}) yielded r = ${fmt(r.r, 3)}, t(${r.df}) = ${fmt(r.tStat, 2)}, p = ${fmtP(r.pValue)}. This represents a ${strength}, ${dir} relationship and is ${sig} at the α = 0.05 level. ${r.pValue < 0.05 ? `As ${x} increases, ${y} tends to ${r.r >= 0 ? "increase" : "decrease"} accordingly.` : "There is insufficient evidence to conclude a linear relationship between the two variables."}`;
}

function buildRegressionInterp(r: RegressionResult): string {
  const sig = r.fPValue < 0.05 ? "statistically significant" : "not statistically significant";
  const significant = r.coefficients.filter((c) => c.name !== "Intercept" && c.pValue < 0.05);
  const sigList = significant.length
    ? `Significant predictors: ${significant.map((c) => `${c.name} (B = ${fmt(c.b, 3)}, p = ${fmtP(c.pValue)})`).join("; ")}.`
    : "No individual predictor reached significance at α = 0.05.";
  return `The regression model predicting ${r.response} from ${r.predictors.join(", ")} (N = ${r.n}) explained ${(r.rSquared * 100).toFixed(1)}% of the variance (R² = ${fmt(r.rSquared, 3)}, adjusted R² = ${fmt(r.adjustedRSquared, 3)}). The overall model was ${sig}, F(${r.k}, ${r.n - r.k - 1}) = ${fmt(r.fStatistic, 2)}, p = ${fmtP(r.fPValue)}. ${sigList}`;
}
