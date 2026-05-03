/** Plain-language definitions for statistical terms used across the Tool page. */
export interface GlossaryEntry {
  term: string;
  short: string;
  detail?: string;
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  cronbach: {
    term: "Cronbach's α (Alpha)",
    short: "Reliability score for multi-item scales (0–1).",
    detail:
      "Measures how consistently a set of items (e.g., Likert questions) measure the same underlying construct. ≥0.70 is conventionally acceptable for research use.",
  },
  pearson: {
    term: "Pearson r (Correlation)",
    short: "Strength & direction of the linear relationship between two numeric variables (−1 to +1).",
    detail:
      "+1 means perfect positive linear relationship, 0 means none, −1 means perfect inverse. Pearson r does not imply causation.",
  },
  regression: {
    term: "Linear Regression",
    short: "Predicts a numeric outcome (Y) from one or more predictors (X) using a best-fit line/plane.",
    detail:
      "Simple = 1 predictor, Multiple = 2+ predictors. Estimates how much Y changes per 1-unit change in each X, holding other predictors constant.",
  },
  responseY: {
    term: "Response variable (Y)",
    short: "The outcome you are trying to predict or explain.",
    detail: "Also called the dependent variable. Plotted on the vertical (Y) axis.",
  },
  predictorX: {
    term: "Predictor variable (X)",
    short: "An input used to predict or explain the response.",
    detail: "Also called independent variable, regressor, or feature. Plotted on the horizontal (X) axis.",
  },
  confidence: {
    term: "Confidence level",
    short: "Probability that a confidence interval contains the true value if the study were repeated.",
    detail: "Common choices: 90%, 95%, 99%. Higher confidence ⇒ wider intervals.",
  },
  alpha: {
    term: "α (Significance level)",
    short: "Maximum risk of a false positive (rejecting H₀ when it is true).",
    detail: "α = 1 − confidence. At 95% confidence, α = 0.05.",
  },
  tail: {
    term: "Tail (One- vs Two-tailed)",
    short: "Whether you test for any difference (two-tailed) or a specific direction (one-tailed).",
    detail:
      "Use two-tailed unless you have a strong prior reason to expect a specific direction (e.g., 'positive only').",
  },
  intercept: {
    term: "Intercept",
    short: "Predicted value of Y when all predictors equal zero.",
    detail: "Excluding the intercept forces the regression line through the origin — only do this with a substantive reason.",
  },
  pValue: {
    term: "p-value",
    short: "Probability of seeing a result this extreme if the null hypothesis were true.",
    detail: "p < α (e.g., < 0.05) ⇒ reject H₀; result is statistically significant.",
  },
  tStat: {
    term: "t-statistic",
    short: "How many standard errors the estimate is away from zero.",
    detail: "Larger |t| ⇒ stronger evidence against H₀. Compared against a t-distribution with df degrees of freedom.",
  },
  df: {
    term: "df (Degrees of freedom)",
    short: "Effective number of independent pieces of information.",
    detail: "For Pearson r: n − 2. For regression residuals: n − k − 1 (with intercept).",
  },
  r: { term: "r", short: "Pearson correlation coefficient (−1 to +1)." },
  rSquared: {
    term: "R² (Coefficient of determination)",
    short: "Share of variance in Y explained by the model (0–1).",
    detail: "R² = 0.62 ⇒ the model explains 62% of the variation in the response.",
  },
  adjRSquared: {
    term: "Adjusted R²",
    short: "R² penalized for adding predictors that don't improve the model.",
    detail: "Use when comparing models with different numbers of predictors.",
  },
  fStat: {
    term: "F-statistic",
    short: "Tests whether the regression model explains more variance than chance.",
    detail: "A significant F (small p) means at least one predictor is useful.",
  },
  ci: {
    term: "Confidence Interval (CI)",
    short: "Plausible range for the true value of a parameter.",
    detail: "If a CI for a slope crosses 0, the predictor is not statistically significant at the chosen α.",
  },
  vif: {
    term: "VIF (Variance Inflation Factor)",
    short: "Detects multicollinearity between predictors.",
    detail: "VIF > 5 (some say > 10) suggests a predictor is highly correlated with the others — coefficients become unstable.",
  },
  se: {
    term: "SE (Standard Error)",
    short: "Estimated standard deviation of the coefficient.",
    detail: "Smaller SE ⇒ more precise estimate.",
  },
  b: {
    term: "B (Unstandardized coefficient)",
    short: "Change in Y per 1-unit increase in this X, holding other predictors constant.",
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
    detail: "Significance ≠ practical importance. Always pair with effect size and CI.",
  },
};
