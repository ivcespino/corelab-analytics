import { useEffect, useState } from "react";

export interface Response {
  subject: string;
  prelim: number;
  midterm: number;
  hours: number;       // winsorized at 10
  hours_raw: number;
  q1: number; q2: number; q3: number; q4: number; q5: number;
  intensity: number;   // composite (Q2 & Q4 reverse-coded), 5–25
  change: number;      // midterm − prelim
}

let cache: Response[] | null = null;

export function useResponses() {
  const [data, setData] = useState<Response[] | null>(cache);
  useEffect(() => {
    if (cache) return;
    fetch("/data/responses.json")
      .then((r) => r.json())
      .then((d: Response[]) => { cache = d; setData(d); })
      .catch((e) => console.error("Failed to load responses.json", e));
  }, []);
  return data;
}
