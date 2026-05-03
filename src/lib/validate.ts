import type { ParsedDataset } from "./csv";

export interface SmartError {
  message: string;
  hint?: string;
}

interface CronbachCtx {
  method: "cronbach";
  selectedItems: string[];
  dataset: ParsedDataset;
}
interface PearsonCtx {
  method: "pearson";
  pearsonX: string;
  pearsonY: string;
  dataset: ParsedDataset;
}
interface RegressionCtx {
  method: "regression";
  regResponse: string;
  regPredictors: string[];
  dataset: ParsedDataset;
}

export type ValidationCtx = CronbachCtx | PearsonCtx | RegressionCtx;

/** Returns the first identifiable issue with the user's selection, or null if it's safe to run. */
export function validate(ctx: ValidationCtx): SmartError | null {
  const { dataset } = ctx;
  if (!dataset || dataset.rows.length === 0) {
    return { message: "No data loaded.", hint: "Paste a CSV or upload a file in Step 1, then press Parse CSV." };
  }
  if (dataset.numericHeaders.length === 0) {
    return {
      message: "No numeric columns detected in your data.",
      hint: "Statistical methods need numeric columns. Check that your CSV uses numbers (not text) for the values you want to analyze.",
    };
  }

  if (ctx.method === "cronbach") {
    if (ctx.selectedItems.length < 2) {
      return {
        message: "Cronbach's α needs at least 2 items.",
        hint: "Tick at least two scale items (e.g., item1, item2, …) under Step 2.",
      };
    }
    const lengths = ctx.selectedItems.map((k) => dataset.columns[k]?.length ?? 0);
    if (new Set(lengths).size > 1) {
      return {
        message: "Selected items have different row counts.",
        hint: "All items must come from the same respondents. Re-check your CSV for missing rows.",
      };
    }
    return null;
  }

  if (ctx.method === "pearson") {
    if (!ctx.pearsonX || !ctx.pearsonY) {
      return { message: "Pick a variable for both X and Y.", hint: "Variable X is the predictor, Variable Y is the outcome." };
    }
    if (ctx.pearsonX === ctx.pearsonY) {
      return {
        message: `You selected the same column (${ctx.pearsonX}) for both X and Y.`,
        hint: "Correlation needs two different variables — change either X or Y to a different column.",
      };
    }
    const xs = dataset.columns[ctx.pearsonX]?.filter(Number.isFinite) ?? [];
    const ys = dataset.columns[ctx.pearsonY]?.filter(Number.isFinite) ?? [];
    if (xs.length < 3 || ys.length < 3) {
      return {
        message: "Not enough numeric values to compute a correlation.",
        hint: "Pearson r needs at least 3 paired observations. Add more rows or pick columns with fewer blanks.",
      };
    }
    return null;
  }

  // regression
  if (!ctx.regResponse) {
    return { message: "Pick a response variable (Y).", hint: "Y is the outcome you want to predict or explain." };
  }
  if (ctx.regPredictors.length === 0) {
    return {
      message: "Pick at least one predictor (X).",
      hint: "Predictors are the inputs used to estimate Y. Use 1 for simple regression, 2+ for multiple regression.",
    };
  }
  if (ctx.regPredictors.includes(ctx.regResponse)) {
    return {
      message: `${ctx.regResponse} is selected as both the response (Y) and a predictor (X).`,
      hint: "A variable can't predict itself. Either change the response, or untick it from the predictors list.",
    };
  }
  const n = dataset.columns[ctx.regResponse]?.filter(Number.isFinite).length ?? 0;
  if (n <= ctx.regPredictors.length + 1) {
    return {
      message: `Too few observations (n = ${n}) for ${ctx.regPredictors.length} predictor(s).`,
      hint: "Linear regression needs more rows than predictors + 1. Add more data or remove predictors.",
    };
  }
  return null;
}
