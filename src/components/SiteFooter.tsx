import { Link } from "react-router-dom";
import { ArrowUp, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Tool", href: "/tool" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Team", href: "/team" },
];

/**
 * Site-wide footer. Uses muted surface tokens so it sits gently below
 * vivid hero / snap sections instead of competing with them.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40 text-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" aria-label="CoreLab Analytics — home" className="inline-block">
            <Logo className="h-9" />
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            A web-based research and visualization tool built by a research group
            from <span className="font-semibold text-foreground">ITMAWD&nbsp;12A</span> at
            STI College Malolos.
          </p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Contact
          </p>
          <a
            href="mailto:corelabanalytics@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Mail className="h-3.5 w-3.5" /> corelabanalytics@gmail.com
          </a>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} CoreLab Analytics — ITMAWD 12A research group · STI College Malolos
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
