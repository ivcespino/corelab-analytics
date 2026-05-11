import { ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroData {
  badge: string;
  heading: string;
  subheading: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  pdfCta?: { label: string; href: string };
  descriptor?: { label: string; body: string };
  stats?: { value: string; label: string }[];
}

export function HeroSection({ data }: { data: HeroData }) {
  return (
    <section
      id="hero"
      data-toc="Overview"
      data-chapter="Chapter 1"
      className="snap-section text-white"
      style={{
        backgroundImage: `var(--gradient-hero), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
            {data.badge}
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            {data.heading}
          </h1>
          <p className="mt-3 font-display text-xl text-accent sm:text-2xl">
            {data.subheading}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={data.primaryCta.href} className="btn-hero-primary">
              {data.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={data.secondaryCta.href} className="btn-hero-ghost">
              {data.secondaryCta.label}
            </Link>
            {data.pdfCta && (
              <a
                href={data.pdfCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hero-ghost"
              >
                <Download className="h-4 w-4" /> {data.pdfCta.label}
              </a>
            )}
          </div>
        </div>

        {data.descriptor ? (
          <div className="fade-up rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {data.descriptor.label}
            </p>
            <p className="mt-4 font-display text-lg leading-snug text-white sm:text-xl">
              {data.descriptor.body}
            </p>
          </div>
        ) : data.stats ? (
          <div className="grid grid-cols-3 gap-3 fade-up sm:gap-4">
            {data.stats.map((s) => (
              <div key={s.label} className="stat-pill text-foreground">
                <p className="font-display text-3xl font-bold text-primary sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-widest text-white/60">
        SCROLL ↓
      </div>
    </section>
  );
}
