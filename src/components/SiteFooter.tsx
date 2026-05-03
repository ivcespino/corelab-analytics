import { Link } from "react-router-dom";
import { ArrowUp, FlaskConical, Mail } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Tool", href: "/tool" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Team", href: "/team" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-br from-primary to-primary/90 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur">
              <FlaskConical className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              CoreLab Analytics
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">
            A web-based research and visualization tool built by a research group
            from <span className="font-semibold text-accent">ITMAWD&nbsp;12A</span> at
            STI College Malolos.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="text-white/80 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Contact
          </p>
          <a
            href="mailto:corelabanalytics@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/10"
          >
            <Mail className="h-3.5 w-3.5" /> corelabanalytics@gmail.com
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 text-xs text-white/60">
          <span>© {new Date().getFullYear()} CoreLab Analytics — ITMAWD 12A research group · STI College Malolos</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 font-semibold transition-colors hover:bg-white/10"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
