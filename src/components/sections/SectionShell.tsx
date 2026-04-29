import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  chapter: string;
  eyebrow: string;
  title: string;
  variant?: "odd" | "even";
  children: ReactNode;
  tocLabel?: string;
}

export function SectionShell({
  id,
  chapter,
  eyebrow,
  title,
  variant = "odd",
  children,
  tocLabel,
}: Props) {
  return (
    <section
      id={id}
      data-toc={tocLabel ?? eyebrow}
      data-chapter={chapter}
      className={cn("snap-section", variant === "odd" ? "bg-odd" : "bg-even")}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary dark:bg-accent/15 dark:text-accent">
            {chapter}
          </span>
          <span className="section-eyebrow">{eyebrow}</span>
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
