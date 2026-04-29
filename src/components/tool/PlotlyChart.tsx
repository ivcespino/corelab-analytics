import { useEffect, useRef } from "react";
import Plotly from "plotly.js-basic-dist-min";
import type * as PlotlyType from "plotly.js";

interface Props {
  data: PlotlyType.Data[];
  layout?: Partial<PlotlyType.Layout>;
  height?: number;
}

/** Lightweight Plotly wrapper that respects the design system */
export function PlotlyChart({ data, layout, height = 420 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    const themed: Partial<PlotlyType.Layout> = {
      autosize: true,
      height,
      margin: { l: 56, r: 24, t: 24, b: 48 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: {
        family: "Inter, system-ui, sans-serif",
        color: isDark ? "#F8F9FA" : "#0F172A",
        size: 12,
      },
      xaxis: {
        gridcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
        zerolinecolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)",
      },
      yaxis: {
        gridcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
        zerolinecolor: isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)",
      },
      legend: { orientation: "h", y: -0.2 },
      ...layout,
    };
    Plotly.newPlot(ref.current, data, themed, {
      displaylogo: false,
      responsive: true,
      modeBarButtonsToRemove: ["lasso2d", "select2d"],
    });
    const handle = () => ref.current && Plotly.Plots.resize(ref.current);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("resize", handle);
      if (ref.current) Plotly.purge(ref.current);
    };
  }, [data, layout, height]);

  return <div ref={ref} className="w-full" />;
}
