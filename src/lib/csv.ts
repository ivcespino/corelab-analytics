import Papa from "papaparse";

export interface ParsedDataset {
  headers: string[];
  rows: Record<string, string>[];
  /** numeric columns keyed by header (NaN preserved for non-numeric) */
  columns: Record<string, number[]>;
  numericHeaders: string[];
}

export function parseCsv(text: string): ParsedDataset {
  const result = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  });
  const rows = result.data.filter((r) => r && Object.keys(r).length > 0);
  const headers = result.meta.fields ?? [];
  const columns: Record<string, number[]> = {};
  for (const h of headers) {
    columns[h] = rows.map((r) => {
      const raw = (r[h] ?? "").toString().trim();
      const v = raw === "" ? NaN : Number(raw);
      return v;
    });
  }
  const numericHeaders = headers.filter((h) => {
    const vals = columns[h].filter((v) => Number.isFinite(v));
    return vals.length >= Math.max(3, columns[h].length * 0.6);
  });
  return { headers, rows, columns, numericHeaders };
}
