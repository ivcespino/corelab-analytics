/** Plain-language definitions for statistical terms used across the Tool page. */
export interface GlossaryEntry {
  term: string;
  short: string;
  detail?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  method: {
    term: "Statistical method",
    short: "The kind of test used to summarise or model your data.",
    detail:
      "Pick by what you want to learn. Cronbach's α checks whether several survey items measure one underlying thing. Pearson r measures how strongly two numeric variables move together. Linear Regression predicts an outcome (Y) from one or more inputs (X) and tells you how much each input matters while holding the others constant.",
  },
  cronbach: {
    term: "Cronbach's α (Alpha)",
    short: "Reliability score for multi-item scales (0–1).",
    detail:
      "Measures how consistently a set of items (e.g., Likert questions) tap the same construct. Rule of thumb: ≥ 0.90 excellent, 0.80–0.89 good, 0.70–0.79 acceptable, < 0.70 questionable. Below 0.70 the composite score should not be used as a single variable.",
  },
  pearson: {
    term: "Pearson r (Correlation)",
    short: "Strength & direction of the linear relationship between two numeric variables (−1 to +1).",
    detail:
      "Sign tells direction (+ together, − inverse). Magnitude tells strength: |r| ≈ .10 weak, .30 moderate, .50+ strong (Cohen). Pearson r assumes a linear relationship and does not imply causation.",
  },
  regression: {
    term: "Linear Regression",
    short: "Predicts a numeric outcome (Y) from one or more predictors (X) using a best-fit line/plane.",
    detail:
      "Simple = 1 predictor, Multiple = 2+. For each predictor it returns a coefficient (β), a standard error, a t-statistic and a p-value. Overall fit is summarised by R² (variance explained) and F (overall significance).",
  },
  responseY: {
    term: "Response variable (Y)",
    short: "The outcome you are trying to predict or explain.",
    detail: "Also called the dependent variable. Plotted on the vertical (Y) axis. In this study, the Performance Change Score is the response.",
  },
  predictorX: {
    term: "Predictor variable (X)",
    short: "An input used to predict or explain the response.",
    detail: "Also called independent variable, regressor, or feature. Plotted on the horizontal (X) axis. Frequency and Intensity are the predictors here.",
  },
  confidence: {
    term: "Confidence level",
    short: "Probability that a confidence interval contains the true value if the study were repeated.",
    detail: "Common choices: 90%, 95%, 99%. Higher confidence ⇒ wider intervals. 95% is the conventional default in social-science research.",
  },
  alpha: {
    term: "α (Significance level)",
    short: "Maximum risk of a false positive (rejecting H₀ when it is true).",
    detail: "α = 1 − confidence. At 95% confidence, α = 0.05 — meaning you accept up to a 5% chance of declaring an effect that isn't real.",
  },
  tail: {
    term: "Tail (One- vs Two-tailed)",
    short: "Whether you test for any difference (two-tailed) or a specific direction (one-tailed).",
    detail:
      "Two-tailed is the safe default — it asks 'is there a relationship in either direction?'. Use one-tailed only when theory predicts a specific direction (e.g., 'more lab hours can only help, never hurt'). One-tailed gives more power but only counts results in the predicted direction.",
  },
  intercept: {
    term: "Intercept",
    short: "Predicted value of Y when all predictors equal zero.",
    detail: "Excluding the intercept forces the regression line through the origin — only do this when zero is a meaningful baseline (rare in social-science data).",
  },
  pValue: {
    term: "p-value",
    short: "Probability of seeing a result this extreme if the null hypothesis were true.",
    detail: "p < α (commonly 0.05) ⇒ reject H₀; the result is statistically significant. p does NOT tell you the size or importance of the effect — always report it alongside r, β, or R².",
  },
  tStat: {
    term: "t-statistic",
    short: "How many standard errors the estimate is away from zero.",
    detail: "Larger |t| ⇒ stronger evidence against H₀. Compared against a t-distribution with df degrees of freedom to produce a p-value.",
  },
  df: {
    term: "df (Degrees of freedom)",
    short: "Effective number of independent pieces of information.",
    detail: "For Pearson r: n − 2. For regression residuals: n − k − 1 (with intercept). Reported in citations as r(df) or F(df1, df2).",
  },
  r: { term: "r", short: "Pearson correlation coefficient (−1 to +1)." },
  rSquared: {
    term: "R² (Coefficient of determination)",
    short: "Share of variance in Y explained by the model (0–1).",
    detail: "R² = 0.62 ⇒ the model explains 62% of the variation in the response. The remaining 38% is unexplained — driven by factors outside the model or random noise.",
  },
  adjRSquared: {
    term: "Adjusted R²",
    short: "R² penalized for adding predictors that don't improve the model.",
    detail: "Use when comparing models with different numbers of predictors — adjusted R² won't reward you for adding noise.",
  },
  fStat: {
    term: "F-statistic",
    short: "Tests whether the regression model explains more variance than chance.",
    detail: "A significant F (small p) means at least one predictor is useful. Reported as F(df1, df2) = value.",
  },
  ci: {
    term: "Confidence Interval (CI)",
    short: "Plausible range for the true value of a parameter.",
    detail: "If a 95% CI for a slope crosses 0, the predictor is not statistically significant at α = 0.05.",
  },
  vif: {
    term: "VIF (Variance Inflation Factor)",
    short: "Detects multicollinearity between predictors.",
    detail: "VIF > 5 (some say > 10) signals a predictor is highly correlated with the others — coefficients become unstable and standard errors inflate. Drop or combine predictors when VIF is high.",
  },
  se: {
    term: "SE (Standard Error)",
    short: "Estimated standard deviation of the coefficient.",
    detail: "Smaller SE ⇒ more precise estimate. Used to build the t-statistic (β / SE) and the confidence interval.",
  },
  b: {
    term: "β / B (Coefficient)",
    short: "Change in Y per 1-unit increase in this X, holding other predictors constant.",
    detail: "A β of +1.4 for Frequency means each additional weekly lab hour predicts a 1.4-point change in the response, with all other predictors held fixed.",
  },
  n: { term: "N (Sample size)", short: "Number of observations used in the analysis." },
  k: { term: "k", short: "Number of items (Cronbach) or predictors (regression)." },
  itemMean: {
    term: "Item mean",
    short: "Average response on a single scale item.",
    detail: "Compare bars: items with very different means may not be measuring the same construct.",
  },
  predicted: {
    term: "Predicted value (Ŷ)",
    short: "What the regression model estimates for Y given the predictors.",
  },
  residual: {
    term: "Residual",
    short: "Observed Y minus predicted Ŷ — the model's error for that row.",
  },
  significance: {
    term: "Statistical significance",
    short: "Result is unlikely to be due to chance alone (p < α).",
    detail: "Significance ≠ practical importance. Always pair with effect size (r, β, R²) and a confidence interval.",
  },
  citation: {
    term: "Citation-style summary",
    short: "A one-line APA-style report you can paste straight into a paper.",
    detail:
      "Standard format reports the test, its degrees of freedom, the test statistic, and the p-value — e.g., 'r(84) = 0.32, p = .003' or 'F(2, 83) = 7.41, p = .001, R² = .15'. Copying this saves you reformatting the result by hand and matches what reviewers expect to see in the Results section.",
  },
};
