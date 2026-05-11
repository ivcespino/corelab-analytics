import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Play,
  FileSpreadsheet,
  Sparkles,
  AlertCircle,
  Download,
  Copy,
  BookOpen,
  Eye,
  Lightbulb,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  describe,
  fmt,
  type CronbachResult,
  type PearsonResult,
  type RegressionResult,
  type Tail,
} from "@/lib/stats";
import {
  interpretCronbach,
  interpretPearson,
  interpretRegression,
  type Interpretation,
} from "@/lib/interpretations";
import {
  DescriptiveTable,
  CronbachTable,
  PearsonTable,
  RegressionTable,
} from "@/components/tool/ResultTables";
import { PlotlyChart } from "@/components/tool/PlotlyChart";
import { DocsSidebar } from "@/components/tool/DocsSidebar";
import { SiteFooter } from "@/components/SiteFooter";
import { StatTooltip } from "@/components/StatTooltip";
import { validate, type SmartError } from "@/lib/validate";

type Method = "cronbach" | "pearson" | "regression";

interface Sample {
  key: string;
  label: string;
  method: Method;
  csv: string;
}

const SAMPLE_LIST: Sample[] = [
  // ───── Cronbach (5) ─────
  {
    key: "cron-class", label: "Classroom satisfaction (4 items)", method: "cronbach",
    csv: `participant,clarity,pacing,materials,overall
1,4,5,4,5
2,3,3,4,3
3,5,5,5,4
4,2,3,2,3
5,4,4,5,4
6,3,4,3,4
7,5,4,5,5
8,2,2,3,2
9,4,5,4,4
10,3,3,4,4
11,5,5,4,5
12,2,3,3,3`,
  },
  {
    key: "cron-sus", label: "App usability — SUS-style (5 items)", method: "cronbach",
    csv: `user,easy,consistent,learnable,confident,enjoyable
1,5,4,5,4,5
2,3,3,4,3,3
3,4,5,4,4,5
4,2,2,3,2,2
5,5,5,5,5,4
6,4,4,4,5,4
7,3,3,3,2,3
8,4,5,4,4,4
9,2,3,2,3,2
10,5,4,5,4,5
11,4,4,3,4,4
12,3,2,3,3,3`,
  },
  {
    key: "cron-stress", label: "Workplace stress (4 items)", method: "cronbach",
    csv: `employee,workload,deadlines,support_rev,recovery_rev
1,5,5,2,2
2,4,4,3,3
3,5,4,2,1
4,3,3,4,4
5,5,5,1,2
6,2,2,5,5
7,4,4,3,2
8,3,3,4,3
9,5,5,2,2
10,2,3,4,5
11,4,5,3,2
12,3,2,5,4`,
  },
  {
    key: "cron-study", label: "Study habits (5 items)", method: "cronbach",
    csv: `student,planning,focus,review,notes,practice
1,4,5,4,4,5
2,3,3,3,4,3
3,5,4,5,5,5
4,2,2,2,3,2
5,4,4,4,4,5
6,3,4,4,3,4
7,5,5,4,5,5
8,2,3,2,2,3
9,4,4,5,4,4
10,3,2,3,3,3
11,5,5,5,4,5
12,3,3,3,4,3`,
  },
  {
    key: "cron-fitness", label: "Fitness motivation (4 items)", method: "cronbach",
    csv: `member,goal,routine,energy,enjoyment
1,5,5,4,5
2,4,3,4,4
3,5,5,5,5
4,3,2,3,2
5,4,4,5,4
6,5,5,4,5
7,2,2,3,3
8,4,4,4,4
9,3,3,2,3
10,5,4,5,5
11,4,5,4,4
12,2,3,3,2`,
  },

  // ───── Pearson (5) ─────
  {
    key: "pear-study", label: "Study hours × exam score (strong +)", method: "pearson",
    csv: `id,study_hours,exam_score
1,12,88
2,5,72
3,15,94
4,3,65
5,10,84
6,8,78
7,14,91
8,2,60
9,11,86
10,7,75
11,16,96
12,4,68`,
  },
  {
    key: "pear-screen", label: "Screen time × sleep (negative)", method: "pearson",
    csv: `id,screen_hours,sleep_hours
1,2,8.5
2,4,7.5
3,6,7.0
4,8,6.0
5,10,5.5
6,3,8.0
7,5,7.2
8,7,6.5
9,9,5.8
10,1,9.0
11,11,5.0
12,6,6.8`,
  },
  {
    key: "pear-height", label: "Height × shoe size (strong +)", method: "pearson",
    csv: `id,height_cm,shoe_size
1,150,5
2,155,6
3,160,7
4,165,8
5,170,9
6,175,10
7,180,11
8,158,6
9,168,8
10,172,9
11,162,7
12,178,11`,
  },
  {
    key: "pear-coffee", label: "Coffee × productivity (weak)", method: "pearson",
    csv: `id,cups_coffee,productivity_score
1,1,72
2,2,75
3,3,78
4,4,76
5,5,74
6,1,68
7,2,80
8,3,72
9,4,82
10,5,70
11,2,77
12,3,79`,
  },
  {
    key: "pear-noise", label: "Random noise (near zero)", method: "pearson",
    csv: `id,x_noise,y_noise
1,3.2,7.1
2,5.8,4.4
3,2.1,6.7
4,7.4,3.2
5,4.6,8.1
6,6.3,2.9
7,1.8,5.5
8,8.1,7.8
9,3.9,4.0
10,5.2,6.4
11,7.7,5.1
12,2.6,3.7`,
  },

  // ───── Regression (5) ─────
  {
    key: "reg-exam", label: "Exam score (study, sleep, GPA)", method: "regression",
    csv: `id,study_hours,sleep_hours,prior_gpa,exam_score
1,12,7,3.4,88
2,5,6,2.8,72
3,15,8,3.7,94
4,3,5,2.5,65
5,10,7,3.2,84
6,8,6.5,3.0,78
7,14,7.5,3.6,91
8,2,5,2.4,60
9,11,7,3.3,86
10,7,6,2.9,75
11,16,8,3.8,96
12,4,5.5,2.6,68`,
  },
  {
    key: "reg-house", label: "House price (sqft, beds, age)", method: "regression",
    csv: `id,sqft,bedrooms,age_years,price_k
1,1200,2,30,210
2,1800,3,15,310
3,2400,4,5,420
4,950,2,40,170
5,2000,3,10,360
6,2800,4,8,490
7,1500,3,25,260
8,1100,2,35,195
9,2200,4,12,395
10,1700,3,20,290
11,2600,4,6,460
12,1300,2,28,225`,
  },
  {
    key: "reg-salary", label: "Salary (years exp, education, certs)", method: "regression",
    csv: `id,years_exp,edu_years,certifications,salary_k
1,2,12,1,42
2,5,16,2,68
3,8,16,3,82
4,12,18,4,105
5,1,12,0,38
6,4,14,2,58
7,7,16,2,76
8,10,18,3,98
9,3,14,1,52
10,6,16,3,74
11,9,18,2,90
12,15,20,5,128`,
  },
  {
    key: "reg-plant", label: "Plant growth (water, light, fertilizer)", method: "regression",
    csv: `id,water_ml,light_hours,fertilizer_g,growth_cm
1,200,6,2,8
2,300,8,4,14
3,150,4,1,5
4,400,10,5,19
5,250,7,3,11
6,350,9,4,16
7,180,5,2,7
8,320,8,4,15
9,220,6,3,10
10,380,10,5,18
11,140,4,1,4
12,280,7,3,12`,
  },
  {
    key: "reg-gym", label: "Gym progress (sessions, sleep, protein)", method: "regression",
    csv: `id,sessions_week,sleep_hours,protein_g,strength_gain
1,2,7,80,4
2,4,8,120,9
3,5,7,140,11
4,3,6,90,5
5,6,8,160,14
6,1,5,60,2
7,4,7,110,8
8,5,8,150,12
9,3,7,100,7
10,6,8,170,15
11,2,6,70,3
12,4,7,130,10`,
  },
];

const SAMPLES: Record<string, Sample> = Object.fromEntries(
  SAMPLE_LIST.map((s) => [s.key, s]),
);
const DEFAULT_SAMPLE = "reg-exam";

interface Results {
  variables: string[];
  cronbach?: CronbachResult;
  pearson?: { result: PearsonResult; x: string; y: string };
  regression?: RegressionResult;
  plot?: { data: Plotly.Data[]; layout?: Partial<Plotly.Layout> };
  interpretation: Interpretation;
  warnings: string[];
}

export default function Tool() {
  const [csvText, setCsvText] = useState(SAMPLES[DEFAULT_SAMPLE].csv);
  const [dataset, setDataset] = useState<ParsedDataset | null>(() =>
    parseCsv(SAMPLES[DEFAULT_SAMPLE].csv),
  );
  const [method, setMethod] = useState<Method>("regression");

  // Parameters
  const [confidence, setConfidence] = useState<string>("0.95");
  const [tail, setTail] = useState<Tail>("two");
  const [includeIntercept, setIncludeIntercept] = useState(true);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pearsonX, setPearsonX] = useState("study_hours");
  const [pearsonY, setPearsonY] = useState("exam_score");
  const [regResponse, setRegResponse] = useState("exam_score");
  const [regPredictors, setRegPredictors] = useState<string[]>(["study_hours", "sleep_hours", "prior_gpa"]);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<SmartError | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const numericHeaders = dataset?.numericHeaders ?? [];
  const conf = Number(confidence);

  const handleParse = (text?: string) => {
    const src = text ?? csvText;
    try {
      const ds = parseCsv(src);
      if (ds.headers.length === 0) throw new Error("No headers detected");
      setDataset(ds);
      setError(null);
      setResults(null);
      toast({
        title: "Data parsed",
        description: `${ds.rows.length} rows · ${ds.headers.length} columns (${ds.numericHeaders.length} numeric)`,
      });
    } catch (e: any) {
      setError({ message: e.message ?? "Failed to parse CSV", hint: "Check that your CSV has a header row and is comma-separated." });
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result ?? "");
      setCsvText(text);
      handleParse(text);
    };
    reader.readAsText(file);
  };

  const loadSample = (key: string) => {
    const s = SAMPLES[key];
    if (!s) return;
    setCsvText(s.csv);
    setMethod(s.method);
    const ds = parseCsv(s.csv);
    setDataset(ds);
    setResults(null);
    setError(null);
    if (s.method === "cronbach") {
      setSelectedItems(ds.numericHeaders.filter((h) => h.startsWith("item")));
    } else if (s.method === "pearson") {
      setPearsonX(ds.numericHeaders[0] ?? "");
      setPearsonY(ds.numericHeaders[1] ?? "");
    } else {
      const last = ds.numericHeaders[ds.numericHeaders.length - 1];
      setRegResponse(last);
      setRegPredictors(ds.numericHeaders.filter((h) => h !== last));
    }
    toast({ title: "Sample loaded", description: s.label });
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, key: string) => {
    setArr(arr.includes(key) ? arr.filter((x) => x !== key) : [...arr, key]);
  };

  const runAnalysis = () => {
    if (!dataset) {
      setError({ message: "No data loaded.", hint: "Paste a CSV or upload a file in Step 1, then press Parse CSV." });
      return;
    }
    const ctx =
      method === "cronbach"
        ? { method, selectedItems, dataset } as const
        : method === "pearson"
        ? { method, pearsonX, pearsonY, dataset } as const
        : { method, regResponse, regPredictors, dataset } as const;
    const v = validate(ctx);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    try {
      const warnings: string[] = [];
      if (dataset.rows.length < 10)
        warnings.push(`Small sample (n = ${dataset.rows.length}). Interpret cautiously.`);

      if (method === "cronbach") {
        const cols = selectedItems.map((k) => dataset.columns[k]);
        const result = cronbachAlpha(cols, { confidence: conf });
        const plot: Results["plot"] = {
          data: [
            {
              type: "bar",
              x: selectedItems,
              y: result.itemMeans,
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
          interpretation: interpretCronbach(result, selectedItems),
          warnings,
        });
      } else if (method === "pearson") {
        const xs = dataset.columns[pearsonX];
        const ys = dataset.columns[pearsonY];
        const result = pearson(xs, ys, { tail, confidence: conf });
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
          interpretation: interpretPearson(result, pearsonX, pearsonY),
          warnings,
        });
      } else {
        const xCols = regPredictors.map((k) => dataset.columns[k]);
        const y = dataset.columns[regResponse];
        const result = linearRegression(xCols, y, regPredictors, regResponse, {
          confidence: conf,
          intercept: includeIntercept,
        });
        if (result.vif) {
          for (const [name, v] of Object.entries(result.vif))
            if (v > 5) warnings.push(`High VIF for ${name} (${fmt(v, 2)})— predictors are correlated.`);
        }
        const plot: Results["plot"] = {
          data: [
            {
              type: "scatter",
              mode: "markers",
              x: result.predicted,
              y: result.predicted.map((p, i) => p + result.residuals[i]),
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
          interpretation: interpretRegression(result),
          warnings,
        });
      }
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (e: any) {
      setError({ message: e.message ?? "Analysis failed", hint: "Try a different method, or load a sample dataset to confirm the tool is working." });
    }
  };

  const copyCitation = async () => {
    if (!results) return;
    await navigator.clipboard.writeText(results.interpretation.citation);
    toast({ title: "Copied", description: results.interpretation.citation });
  };

  const exportReport = () => {
    if (!results) return;
    const i = results.interpretation;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>CoreLab Report</title>
<style>body{font:14px/1.6 -apple-system,Inter,sans-serif;max-width:780px;margin:40px auto;padding:0 20px;color:#0F172A}h1{font-size:28px}h2{margin-top:32px;border-bottom:1px solid #ccc;padding-bottom:6px}.k{color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.1em}blockquote{border-left:3px solid #00B8D4;padding-left:14px;color:#334155;margin:8px 0}</style>
</head><body>
<h1>CoreLab Analytics— Statistical Report</h1>
<p class="k">Generated ${new Date().toLocaleString()}</p>
<h2>Reading the Result</h2>
<p class="k">What you ran</p><blockquote>${stripMd(i.ran)}</blockquote>
<p class="k">What the chart shows</p><blockquote>${stripMd(i.chart)}</blockquote>
<p class="k">What the numbers mean</p><blockquote>${stripMd(i.numbers)}</blockquote>
${i.implies ? `<p class="k">What it implies</p><blockquote>${stripMd(i.implies)}</blockquote>` : ""}
<p class="k">Citation-style summary</p><pre>${i.citation}</pre>
${results.warnings.length ? `<p class="k">Warnings</p><ul>${results.warnings.map((w) => `<li>${w}</li>`).join("")}</ul>` : ""}
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `corelab-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          {/* Hero */}
          <div className="mb-10 max-w-3xl">
            <span className="section-eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> Statistical Analysis Tool
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Test your survey data in seconds.
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Paste a CSV, pick a method, and CoreLab returns the same descriptive
              table, statistics, chart and plain-language reading you'd expect in a
              methodology section— no spreadsheets required.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-8 min-w-0">
              {/* Data input */}
              <section className="glass-card p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-xl font-bold">1. Load your data</h2>
                  {dataset && (
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {dataset.rows.length} rows · {dataset.numericHeaders.length} numeric cols
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">Try a sample dataset (5 per method)</Label>
                  <Select onValueChange={loadSample}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Choose a sample dataset…" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["cronbach", "pearson", "regression"] as const).map((m) => (
                        <SelectGroup key={m}>
                          <SelectLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            {m === "cronbach" ? "Cronbach's α (reliability)" : m === "pearson" ? "Pearson r (correlation)" : "Linear Regression"}
                          </SelectLabel>
                          {SAMPLE_LIST.filter((s) => s.method === m).map((s) => (
                            <SelectItem key={s.key} value={s.key}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Button onClick={() => handleParse()}>
                      <FileSpreadsheet className="h-4 w-4" /> Parse CSV
                    </Button>
                    <Button variant="outline" onClick={() => fileRef.current?.click()}>
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

              {/* Method + parameters + variable selection */}
              <section className="glass-card p-6 sm:p-7">
                <h2 className="font-display text-xl font-bold">
                  2. Pick a method &amp; variables
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Not sure which to choose? Hover the dotted labels for plain-language help.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>
                      <StatTooltip termKey="method">
                        <span>Statistical method</span>
                      </StatTooltip>
                    </Label>
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
                        <SelectItem value="cronbach">Cronbach's Alpha— survey reliability</SelectItem>
                        <SelectItem value="pearson">Pearson R— relationship between two variables</SelectItem>
                        <SelectItem value="regression">Linear Regression— predict an outcome</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                      {method === "cronbach" && "Use when several Likert/scale items are meant to measure one thing."}
                      {method === "pearson" && "Use to see how strongly two numeric columns move together."}
                      {method === "regression" && "Use to predict one numeric column (Y) from one or more others (X)."}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={runAnalysis} className="w-full" size="lg">
                      <Play className="h-4 w-4" /> Run Analysis
                    </Button>
                  </div>
                </div>

                {/* Parameters */}
                <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" /> Parameters
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <Label className="text-xs">
                        <StatTooltip termKey="confidence"><span>Confidence level</span></StatTooltip>
                      </Label>
                      <Select value={confidence} onValueChange={setConfidence}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.90">90%</SelectItem>
                          <SelectItem value="0.95">95%</SelectItem>
                          <SelectItem value="0.99">99%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {method === "pearson" && (
                      <div>
                        <Label className="text-xs">
                          <StatTooltip termKey="tail"><span>Tail</span></StatTooltip>
                        </Label>
                        <Select value={tail} onValueChange={(v) => setTail(v as Tail)}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="two">Two-tailed</SelectItem>
                            <SelectItem value="greater">One-tailed (positive)</SelectItem>
                            <SelectItem value="less">One-tailed (negative)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {method === "regression" && (
                      <label className="flex items-end gap-2 pb-2">
                        <Checkbox
                          checked={includeIntercept}
                          onCheckedChange={(c) => setIncludeIntercept(Boolean(c))}
                        />
                        <span className="text-sm">
                          <StatTooltip termKey="intercept"><span>Include intercept</span></StatTooltip>
                        </span>
                      </label>
                    )}
                    {method === "cronbach" && (
                      <p className="text-xs text-muted-foreground sm:col-span-2 md:col-span-2">
                        Cronbach's α has no extra parameters. The confidence level above
                        sets how wide the plausible-range bar around α will be.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {method === "cronbach" && (
                    <VariableChecklist
                      label="Select scale items (≥ 2)"
                      headers={numericHeaders}
                      selected={selectedItems}
                      onToggle={(k) => toggle(selectedItems, setSelectedItems, k)}
                      dataset={dataset}
                    />
                  )}
                  {method === "pearson" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>
                          <StatTooltip termKey="predictorX"><span>Variable X (predictor)</span></StatTooltip>
                        </Label>
                        <Select value={pearsonX} onValueChange={setPearsonX}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {dataset && <VarPreview ds={dataset} name={pearsonX} />}
                      </div>
                      <div>
                        <Label>
                          <StatTooltip termKey="responseY"><span>Variable Y (response)</span></StatTooltip>
                        </Label>
                        <Select value={pearsonY} onValueChange={setPearsonY}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {dataset && <VarPreview ds={dataset} name={pearsonY} />}
                      </div>
                    </div>
                  )}
                  {method === "regression" && (
                    <div className="space-y-5">
                      <div>
                        <Label>
                          <StatTooltip termKey="responseY"><span>Response (Y)</span></StatTooltip>
                        </Label>
                        <Select value={regResponse} onValueChange={(v) => { setRegResponse(v); setRegPredictors([]); }}>
                          <SelectTrigger className="mt-1.5 sm:max-w-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {numericHeaders.map((h) => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {dataset && <VarPreview ds={dataset} name={regResponse} />}
                      </div>
                      <VariableChecklist
                        label="Predictors (X)— pick 1 for simple, 2+ for multiple"
                        labelTooltipKey="predictorX"
                        headers={numericHeaders.filter((h) => h !== regResponse)}
                        selected={regPredictors}
                        onToggle={(k) => toggle(regPredictors, setRegPredictors, k)}
                        dataset={dataset}
                      />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mt-5 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-semibold">{error.message}</p>
                      {error.hint && (
                        <p className="text-destructive/85 text-[13px] leading-relaxed">
                          <span className="font-semibold">How to fix:</span> {error.hint}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Results */}
              <div ref={resultsRef}>
                {results && dataset && (
                  <section className="space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <span className="section-eyebrow">Standardized Report</span>
                        <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                          3. Your results
                        </h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={copyCitation}>
                          <Copy className="h-4 w-4" /> Copy citation
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportReport}>
                          <Download className="h-4 w-4" /> Export report
                        </Button>
                      </div>
                    </div>

                    {results.warnings.length > 0 && (
                      <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <ul className="space-y-1">
                          {results.warnings.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    )}

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

                    <ReadingTheResult i={results.interpretation} />
                  </section>
                )}
              </div>
            </div>

            <DocsSidebar />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

// ───────── Reading the Result panel ─────────
function ReadingTheResult({ i }: { i: Interpretation }) {
  const blocks = [
    { icon: BookOpen, label: "What you ran", body: i.ran, key: "ran" },
    { icon: BarChart3, label: "What the chart shows", body: i.chart, key: "chart" },
    { icon: Eye, label: "What the numbers mean", body: i.numbers, key: "num" },
    ...(i.implies ? [{ icon: Lightbulb, label: "What it implies", body: i.implies, key: "imp" }] : []),
  ];
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles className="h-4 w-4" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          Reading the Result
        </span>
      </div>
      <h4 className="mt-1 font-display text-lg font-bold">
        Plain-language summary of your analysis
      </h4>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {blocks.map(({ icon: Icon, label, body, key }) => (
          <div key={key} className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-accent" />
              {label}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {renderRich(body)}
            </p>
          </div>
        ))}
      </div>
              <div className="mt-5 rounded-lg border border-border/60 bg-card px-4 py-3 font-mono text-xs">
                <span className="mr-2 text-muted-foreground">
                  <StatTooltip termKey="citation"><span>Citation</span></StatTooltip>:
                </span>
                {i.citation}
              </div>
    </div>
  );
}

/** Render text with **bold** and [[var:name]] variable chips. */
function renderRich(s: string) {
  // Split by either **bold** or [[var:...]]
  const parts = s.split(/(\*\*[^*]+\*\*|\[\[var:[^\]]+\]\])/g);
  return parts.map((part, i) => {
    const bold = /^\*\*(.+)\*\*$/.exec(part);
    if (bold) return <strong key={i} className="font-semibold text-foreground">{bold[1]}</strong>;
    const v = /^\[\[var:(.+)\]\]$/.exec(part);
    if (v) return <VarChip key={i} name={v[1]} />;
    return <span key={i}>{part}</span>;
  });
}

function VarChip({ name }: { name: string }) {
  return (
    <code className="mx-0.5 inline-flex items-center rounded-md border border-accent/40 bg-accent/10 px-1.5 py-0.5 font-mono text-[12px] font-semibold text-accent shadow-[0_1px_0_hsl(var(--accent)/0.25)]">
      {name}
    </code>
  );
}

function VariableChecklist({
  label,
  labelTooltipKey,
  headers,
  selected,
  onToggle,
  dataset,
}: {
  label: string;
  labelTooltipKey?: "predictorX" | "responseY" | "cronbach";
  headers: string[];
  selected: string[];
  onToggle: (k: string) => void;
  dataset: ParsedDataset | null;
}) {
  return (
    <div>
      <Label>
        {labelTooltipKey ? (
          <StatTooltip termKey={labelTooltipKey}><span>{label}</span></StatTooltip>
        ) : (
          label
        )}
      </Label>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {headers.map((h) => {
          const stats = dataset
            ? describe(h, dataset.columns[h].filter((v) => Number.isFinite(v)))
            : null;
          return (
            <label
              key={h}
              className="flex cursor-pointer items-start gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <Checkbox
                checked={selected.includes(h)}
                onCheckedChange={() => onToggle(h)}
                className="mt-0.5"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{h}</span>
                {stats && (
                  <span className="block text-[10px] text-muted-foreground tabular-nums">
                    n={stats.n} · M={fmt(stats.mean, 2)} · SD={fmt(stats.sd, 2)}
                  </span>
                )}
              </span>
            </label>
          );
        })}
        {headers.length === 0 && (
          <p className="text-sm text-muted-foreground">No numeric columns available.</p>
        )}
      </div>
    </div>
  );
}

function VarPreview({ ds, name }: { ds: ParsedDataset; name: string }) {
  const stats = useMemo(() => {
    const col = ds.columns[name];
    if (!col) return null;
    return describe(name, col.filter((v) => Number.isFinite(v)));
  }, [ds, name]);
  if (!stats) return null;
  return (
    <p className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
      n={stats.n} · M={fmt(stats.mean, 2)} · SD={fmt(stats.sd, 2)} · range [{fmt(stats.min, 2)}, {fmt(stats.max, 2)}]
    </p>
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

/** Strip our mini-markup for HTML report export. */
function stripMd(s: string) {
  return s
    .replace(/\[\[var:([^\]]+)\]\]/g, "<code style=\"background:#ECFEFF;border:1px solid #67E8F9;color:#0E7490;padding:1px 6px;border-radius:4px;font-family:ui-monospace,monospace;font-size:.92em\">$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
