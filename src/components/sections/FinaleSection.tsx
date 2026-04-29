import { ArrowUp, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface FinaleData {
  eyebrow: string;
  title: string;
  description: string;
  links: { label: string; href: string; icon: string }[];
  footer: string;
}

export function FinaleSection({
  data,
  onBackToTop,
}: {
  data: FinaleData;
  onBackToTop: () => void;
}) {
  return (
    <section
      id="finale"
      data-toc="Continue"
      data-chapter="Continue"
      className="snap-section bg-gradient-hero text-white"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        <span className="section-eyebrow">{data.eyebrow}</span>
        <h2 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
          {data.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-white/80">{data.description}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {data.links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 p-5 backdrop-blur transition-all hover:border-accent hover:bg-white/10"
            >
              <div>
                <p className="font-display text-lg font-semibold">{l.label}</p>
                <p className="text-xs text-white/60">{l.href}</p>
              </div>
              <ExternalLink className="h-5 w-5 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl items-center justify-between border-t border-white/10 pt-6 text-sm text-white/60">
        <span>{data.footer}</span>
        <button
          onClick={onBackToTop}
          className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/10"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}
