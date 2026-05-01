// Statistical engine for CoreLab Analytics
// Cronbach's Alpha, Pearson R, and Linear Regression (simple & multiple)

import * as ss from "simple-statistics";
// @ts-ignore — jstat ships its own loose types
import { jStat } from "jstat";

export type NumMatrix = number[][]; // rows x cols

export interface Descriptive {
  variable: string;
  n: number;
  mean: number;
  sd: number;
  min: number;
  max: number;
}

export function describe(name: string, x: number[]): Descriptive {
  return {
    variable: name,
    n: x.length,
    mean: ss.mean(x),
    sd: x.length > 1 ? ss.sampleStandardDeviation(x) : 0,
    min: ss.min(x),
    max: ss.max(x),
  };
}

/** Convert columns (array of arrays) into row-major numeric matrix, dropping rows with any NaN */
export function buildMatrix(cols: number[][]): NumMatrix {
  const n = Math.min(...cols.map((c) => c.length));
  const out: NumMatrix = [];
  for (let i = 0; i < n; i++) {
    const row = cols.map((c) => c[i]);
    if (row.every((v) => Number.isFinite(v))) out.push(row);
  }
  return out;
}

// ───────── Cronbach's Alpha ─────────
export interface CronbachResult {
  alpha: number;
  k: number;
  n: number;
  itemVariances: number[];
  totalVariance: number;
  itemMeans: number[];
  confidence: number; // e.g. 0.95
  ciLower: number;
  ciUpper: number;
}

/** Feldt approximate CI for Cronbach's alpha. */
export function cronbachAlpha(
  items: number[][],
  options: { confidence?: number } = {},
): CronbachResult {
  const confidence = options.confidence ?? 0.95;
  const matrix = buildMatrix(items); // rows=respondents, cols=items
  const k = items.length;
  const n = matrix.length;
  const itemVars = items.map((_, j) =>
    ss.sampleVariance(matrix.map((r) => r[j])),
  );
  const itemMeans = items.map((_, j) =>
    ss.mean(matrix.map((r) => r[j])),
  );
  const totals = matrix.map((r) => r.reduce((a, b) => a + b, 0));
  const totalVar = ss.sampleVariance(totals);
  const sumItemVar = itemVars.reduce((a, b) => a + b, 0);
  const alpha = (k / (k - 1)) * (1 - sumItemVar / totalVar);

  // Feldt CI: 1 - (1 - α) * F-quantile
  const df1 = n - 1;
  const df2 = (n - 1) * (k - 1);
  const a = 1 - confidence;
  let ciLower = NaN, ciUpper = NaN;
  if (df1 > 0 && df2 > 0) {
    const fLow = jStat.centralF.inv(1 - a / 2, df1, df2);
    const fHigh = jStat.centralF.inv(a / 2, df1, df2);
    ciLower = 1 - (1 - alpha) * fLow;
    ciUpper = 1 - (1 - alpha) * fHigh;
  }
  return { alpha, k, n, itemVariances: itemVars, itemMeans, totalVariance: totalVar, confidence, ciLower, ciUpper };
}

// ───────── Pearson R ─────────
export type Tail = "two" | "greater" | "less";

export interface PearsonResult {
  r: number;
  n: number;
  tStat: number;
  pValue: number;
  df: number;
  tail: Tail;
  confidence: number;
  ciLower: number;
  ciUpper: number;
}

export function pearson(
  x: number[],
  y: number[],
  options: { tail?: Tail; confidence?: number } = {},
): PearsonResult {
  const tail: Tail = options.tail ?? "two";
  const confidence = options.confidence ?? 0.95;
  const matrix = buildMatrix([x, y]);
  const xs = matrix.map((r) => r[0]);
  const ys = matrix.map((r) => r[1]);
  const n = xs.length;
  const r = ss.sampleCorrelation(xs, ys);
  const df = n - 2;
  const t = (r * Math.sqrt(df)) / Math.sqrt(1 - r * r);
  let p: number;
  if (tail === "two") p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));
  else if (tail === "greater") p = 1 - jStat.studentt.cdf(t, df);
  else p = jStat.studentt.cdf(t, df);

  // Fisher z CI
  let ciLower = NaN, ciUpper = NaN;
  if (n > 3 && Math.abs(r) < 1) {
    const z = 0.5 * Math.log((1 + r) / (1 - r));
    const se = 1 / Math.sqrt(n - 3);
    const zCrit = jStat.normal.inv(1 - (1 - confidence) / 2, 0, 1);
    const zL = z - zCrit * se;
    const zU = z + zCrit * se;
    ciLower = (Math.exp(2 * zL) - 1) / (Math.exp(2 * zL) + 1);
    ciUpper = (Math.exp(2 * zU) - 1) / (Math.exp(2 * zU) + 1);
  }
  return { r, n, tStat: t, pValue: p, df, tail, confidence, ciLower, ciUpper };
}

// ───────── Linear Regression (simple & multiple) ─────────
export interface RegressionCoefficient {
  name: string;
  b: number;
  se: number;
  tStat: number;
  pValue: number;
  ciLower: number;
  ciUpper: number;
}

export interface RegressionResult {
  predictors: string[];
  response: string;
  n: number;
  k: number; // number of predictors (excl. intercept)
  rSquared: number;
  adjustedRSquared: number;
  fStatistic: number;
  fPValue: number; // Significance F
  coefficients: RegressionCoefficient[]; // intercept first (if included)
  predicted: number[];
  residuals: number[];
  hasIntercept: boolean;
  confidence: number;
  vif?: Record<string, number>;
}

/** OLS via normal equations: β = (XᵀX)⁻¹ Xᵀy. */
export function linearRegression(
  xCols: number[][],
  y: number[],
  predictorNames: string[],
  responseName: string,
  options: { confidence?: number; intercept?: boolean } = {},
): RegressionResult {
  const confidence = options.confidence ?? 0.95;
  const hasIntercept = options.intercept ?? true;
  const matrix = buildMatrix([...xCols, y]);
  const n = matrix.length;
  const k = xCols.length;
  const X: number[][] = matrix.map((r) =>
    hasIntercept ? [1, ...r.slice(0, k)] : [...r.slice(0, k)],
  );
  const Y: number[] = matrix.map((r) => r[k]);

  const Xt = transpose(X);
  const XtX = mul(Xt, X);
  const XtXinv = invert(XtX);
  const XtY = mulVec(Xt, Y);
  const beta = mulVec(XtXinv, XtY);

  const yhat = X.map((row) => row.reduce((s, v, i) => s + v * beta[i], 0));
  const resid = Y.map((v, i) => v - yhat[i]);
  const yMean = ss.mean(Y);
  const ssTot = hasIntercept
    ? Y.reduce((s, v) => s + (v - yMean) ** 2, 0)
    : Y.reduce((s, v) => s + v * v, 0);
  const ssRes = resid.reduce((s, v) => s + v * v, 0);
  const ssReg = ssTot - ssRes;
  const r2 = 1 - ssRes / ssTot;
  const dfRes = n - k - (hasIntercept ? 1 : 0);
  const adjR2 = 1 - ((1 - r2) * (n - 1)) / dfRes;

  const dfReg = k;
  const F = (ssReg / dfReg) / (ssRes / dfRes);
  const fP = 1 - jStat.centralF.cdf(F, dfReg, dfRes);

  const sigma2 = ssRes / dfRes;
  const coefSE = XtXinv.map((row, i) => Math.sqrt(sigma2 * row[i]));
  const names = hasIntercept ? ["Intercept", ...predictorNames] : [...predictorNames];
  const tCrit = jStat.studentt.inv(1 - (1 - confidence) / 2, dfRes);
  const coefficients: RegressionCoefficient[] = beta.map((b, i) => {
    const se = coefSE[i];
    const t = b / se;
    const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), dfRes));
    return { name: names[i], b, se, tStat: t, pValue: p, ciLower: b - tCrit * se, ciUpper: b + tCrit * se };
  });

  // VIF: regress each predictor on the rest
  let vif: Record<string, number> | undefined;
  if (k >= 2) {
    vif = {};
    for (let i = 0; i < k; i++) {
      const others = xCols.filter((_, j) => j !== i);
      const target = xCols[i];
      try {
        const sub = linearRegression(
          others,
          target,
          predictorNames.filter((_, j) => j !== i),
          predictorNames[i],
          { confidence, intercept: true },
        );
        vif[predictorNames[i]] = 1 / (1 - sub.rSquared);
      } catch {
        vif[predictorNames[i]] = NaN;
      }
    }
  }

  return {
    predictors: predictorNames,
    response: responseName,
    n,
    k,
    rSquared: r2,
    adjustedRSquared: adjR2,
    fStatistic: F,
    fPValue: fP,
    coefficients,
    predicted: yhat,
    residuals: resid,
    hasIntercept,
    confidence,
    vif,
  };
}

// ───────── small matrix helpers ─────────
function transpose(A: number[][]): number[][] {
  return A[0].map((_, j) => A.map((row) => row[j]));
}
function mul(A: number[][], B: number[][]): number[][] {
  const m = A.length, n = B[0].length, p = B.length;
  const out: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let r = 0; r < p; r++) s += A[i][r] * B[r][j];
      out[i][j] = s;
    }
  return out;
}
function mulVec(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((s, x, i) => s + x * v[i], 0));
}
/** Gauss-Jordan inversion */
function invert(M: number[][]): number[][] {
  const n = M.length;
  const A = M.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++)
      if (Math.abs(A[r][i]) > Math.abs(A[pivot][i])) pivot = r;
    [A[i], A[pivot]] = [A[pivot], A[i]];
    const div = A[i][i];
    if (Math.abs(div) < 1e-12) throw new Error("Matrix is singular");
    for (let j = 0; j < 2 * n; j++) A[i][j] /= div;
    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const f = A[r][i];
      for (let j = 0; j < 2 * n; j++) A[r][j] -= f * A[i][j];
    }
  }
  return A.map((row) => row.slice(n));
}

// ───────── formatting helpers ─────────
export const fmt = (v: number, d = 4) =>
  Number.isFinite(v) ? v.toFixed(d) : "—";
export const fmtP = (p: number) =>
  !Number.isFinite(p) ? "—" : p < 0.0001 ? "<0.0001" : p.toFixed(4);
