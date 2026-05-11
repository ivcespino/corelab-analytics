import { fmt, fmtP } from "./stats";
import type { CronbachResult, PearsonResult, RegressionResult, Tail } from "./stats";

export interface Interpretation {
  ran: string;
  chart: string;
  numbers: string;
  implies?: string;
  citation: string;
}

const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
/** Wrap a variable name so the renderer can style it as a chip without altering the name. */
const v = (name: string) => `[[var:${name}]]`;

export function interpretPearson(r: PearsonResult, x: string, y: string): Interpretation {
  const alpha = 1 - r.confidence;
  const tailLabel: Record<Tail, string> = {
    two: "two-tailed",
    greater: "one-tailed (positive)",
    less: "one-tailed (negative)",
  };
  const dir = r.r >= 0 ? "positive" : "negative";
  const absR = Math.abs(r.r);
  const strength =
    absR >= 0.7 ? "strong" : absR >= 0.4 ? "moderate" : absR >= 0.2 ? "weak" : "very weak";
  const sig = r.pValue < alpha;
  const ranSentence = `Pearson correlation between ${v(x)} and ${v(y)} with n = ${r.n}, ${tailLabel[r.tail]} test at ${pct(r.confidence)} confidence.`;
  const slopeWord = r.r >= 0 ? "rise together" : "move in opposite directions";
  const tightness =
    absR >= 0.7 ? "cluster tightly along it" :
    absR >= 0.4 ? "follow it with moderate scatter" :
    "scatter widely around it";
  const chart = `The scatter plot shows each observation as a point with ${v(x)} on the X axis and ${v(y)} on the Y axis. The straight line is a least-squares trend line— it ${r.r >= 0 ? "slopes upward" : "slopes downward"}, meaning the two variables tend to ${slopeWord}. Points ${tightness}, which reflects how reliable the relationship is.`;
  const ciTxt = Number.isFinite(r.ciLower)
    ? ` The ${pct(r.confidence)} confidence interval for r is [${fmt(r.ciLower, 3)}, ${fmt(r.ciUpper, 3)}].`
    : "";
  const numbers = `r = ${fmt(r.r, 3)} indicates a **${strength} ${dir}** linear relationship. With t(${r.df}) = ${fmt(r.tStat, 2)} and p = ${fmtP(r.pValue)}, the result is **${sig ? "statistically significant" : "not statistically significant"}** at α = ${fmt(alpha, 2)}.${ciTxt}`;
  const implies = sig
    ? `At ${pct(r.confidence)} confidence, there is evidence of a linear association between ${v(x)} and ${v(y)}: as ${v(x)} increases, ${v(y)} tends to ${r.r >= 0 ? "increase" : "decrease"}. Note that correlation does not establish causation— a third variable could drive both.`
    : `At ${pct(r.confidence)} confidence, there is **insufficient evidence** to conclude a linear association between ${v(x)} and ${v(y)}. This does not prove they are unrelated; the sample may simply be too small or the relationship non-linear.`;
  const citation = `r(${r.df}) = ${r.r.toFixed(2).replace(/^0/, "")}, p ${r.pValue < 0.001 ? "< .001" : "= " + r.pValue.toFixed(3).replace(/^0/, "")}`;
  return { ran: ranSentence, chart, numbers, implies, citation };
}

export function interpretRegression(r: RegressionResult): Interpretation {
  const alpha = 1 - r.confidence;
  const ran = `${r.k === 1 ? "Simple" : "Multiple"} linear regression predicting ${v(r.response)} from ${r.predictors.map(v).join(", ")} with n = ${r.n}, ${r.hasIntercept ? "intercept included" : "no intercept"}, at ${pct(r.confidence)} confidence.`;
  const chart = `The plot shows **observed vs. predicted** values of ${v(r.response)}. Each point is one row of your data: the X coordinate is what the model predicted, the Y coordinate is the actual value. The dashed diagonal is the line of perfect prediction— points hugging this line mean the model fits well; points scattered far from it mean large residual errors.`;
  const fSig = r.fPValue < alpha;
  const dfRes = r.n - r.k - (r.hasIntercept ? 1 : 0);
  const sigCoefs = r.coefficients.filter(
    (c) => c.name !== "Intercept" && c.pValue < alpha,
  );
  const numbers = `R² = ${fmt(r.rSquared, 3)} means the model explains **${(r.rSquared * 100).toFixed(1)}%** of the variance in ${v(r.response)} (Adjusted R² = ${fmt(r.adjustedRSquared, 3)}). The overall F(${r.k}, ${dfRes}) = ${fmt(r.fStatistic, 2)}, p = ${fmtP(r.fPValue)} is **${fSig ? "statistically significant" : "not statistically significant"}** at α = ${fmt(alpha, 2)}. ${sigCoefs.length} of ${r.predictors.length} predictor(s) are individually significant.`;
  const coefSentences = r.coefficients
    .filter((c) => c.name !== "Intercept")
    .map((c) => {
      const sig = c.pValue < alpha;
      const dir = c.b >= 0 ? "increase" : "decrease";
      return sig
        ? `A 1-unit increase in ${v(c.name)} is associated with a ${fmt(Math.abs(c.b), 3)}-unit ${dir} in ${v(r.response)} (B = ${fmt(c.b, 3)}, ${pct(r.confidence)} CI [${fmt(c.ciLower, 3)}, ${fmt(c.ciUpper, 3)}], p = ${fmtP(c.pValue)}).`
        : `${v(c.name)} is **not** a significant predictor (B = ${fmt(c.b, 3)}, CI crosses 0: [${fmt(c.ciLower, 3)}, ${fmt(c.ciUpper, 3)}], p = ${fmtP(c.pValue)}).`;
    })
    .join(" ");
  const implies = `${fSig ? `The model as a whole is meaningful at ${pct(r.confidence)} confidence.` : `The model as a whole does not reach significance at ${pct(r.confidence)} confidence— interpret individual coefficients with caution.`} ${coefSentences}`;
  const citation = `R² = ${r.rSquared.toFixed(2).replace(/^0/, "")}, F(${r.k}, ${dfRes}) = ${r.fStatistic.toFixed(2)}, p ${r.fPValue < 0.001 ? "< .001" : "= " + r.fPValue.toFixed(3).replace(/^0/, "")}`;
  return { ran, chart, numbers, implies, citation };
}

export function interpretCronbach(r: CronbachResult, items: string[]): Interpretation {
  const ran = `Cronbach's α reliability analysis on ${r.k} items (${items.map(v).join(", ")}) across ${r.n} respondents at ${pct(r.confidence)} confidence.`;
  const meanOfMeans = r.itemMeans.reduce((a, b) => a + b, 0) / r.itemMeans.length;
  const outliers = items.filter((_, i) => Math.abs(r.itemMeans[i] - meanOfMeans) > 0.75);
  const chart = `The bar chart plots the **mean response for each item**. Bars of similar height suggest items behave consistently; a bar that stands far above or below the others may be tapping a different construct.${outliers.length ? ` Items to inspect: ${outliers.map(v).join(", ")}.` : ""}`;
  const verdict =
    r.alpha >= 0.9 ? "excellent" :
    r.alpha >= 0.8 ? "good" :
    r.alpha >= 0.7 ? "acceptable" :
    r.alpha >= 0.6 ? "questionable" :
    r.alpha >= 0.5 ? "poor" : "unacceptable";
  const ciTxt = Number.isFinite(r.ciLower)
    ? ` The ${(r.confidence * 100).toFixed(0)}% confidence interval for α is [${fmt(r.ciLower, 3)}, ${fmt(r.ciUpper, 3)}].`
    : "";
  const numbers = `α = ${fmt(r.alpha, 3)} indicates **${verdict}** internal consistency.${ciTxt} The conventional minimum threshold for research use is α ≥ 0.70.`;
  const implies = r.alpha >= 0.7
    ? `The scale is **reliable enough for research use**— its items behave as a coherent measure of one underlying construct.`
    : `Reliability falls below the conventional 0.70 threshold. Consider **revising or removing** items whose mean diverges sharply from the rest, or adding more items measuring the same construct.`;
  const citation = `α = ${r.alpha.toFixed(2).replace(/^0/, "")}, k = ${r.k}, N = ${r.n}`;
  return { ran, chart, numbers, implies, citation };
}
