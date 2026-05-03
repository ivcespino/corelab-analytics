import { useEffect, useState } from "react";
import { Mail, Crown, GraduationCap, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface Researcher {
  name: string;
  initials: string;
  role: string;
  tag: string | null;
  email: string;
}
interface Adviser { name: string; title: string; blurb: string }
interface TeamData {
  intro: { eyebrow: string; title: string; description: string };
  researchers: Researcher[];
  advisers: Adviser[];
  contact: { title: string; description: string; email: string };
}

export default function Team() {
  const [data, setData] = useState<TeamData | null>(null);

  useEffect(() => {
    fetch("/team.json").then((r) => r.json()).then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <>
        <SiteHeader />
        <div className="grid min-h-screen place-items-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </>
    );
  }

  const lead = data.researchers.find((r) => r.tag);
  const others = data.researchers.filter((r) => !r.tag);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background pt-24">
        {/* Intro */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-soft via-background to-background dark:from-primary/10" />
          <div className="absolute -top-32 -right-32 -z-10 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
            <span className="section-eyebrow">{data.intro.eyebrow}</span>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              {data.intro.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {data.intro.description}
            </p>
          </div>
        </section>

        {/* Researchers */}
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">The Researchers</h2>
            <span className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline">
              ITMAWD 12A · {data.researchers.length} members
            </span>
          </div>

          {lead && <LeadCard r={lead} />}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => <PersonCard key={r.email} r={r} />)}
          </div>
        </section>

        {/* Advisers */}
        <section className="border-t border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Acknowledgments &amp; Supervision</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              The faculty advisers whose guidance shaped this study.
            </p>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {data.advisers.map((a) => (
                <article
                  key={a.name}
                  className="glass-card relative overflow-hidden p-7 transition-shadow hover:shadow-strong"
                >
                  <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary dark:bg-accent/15 dark:text-accent">
                    <GraduationCap className="h-6 w-6" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">{a.title}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{a.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="glass-card relative overflow-hidden bg-gradient-to-br from-primary to-primary/85 p-10 text-white sm:p-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Get in touch</span>
                <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{data.contact.title}</h2>
                <p className="mt-4 max-w-xl text-white/80">{data.contact.description}</p>
              </div>
              <a
                href={`mailto:${data.contact.email}`}
                className="group inline-flex items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/10 p-5 backdrop-blur transition-all hover:border-accent hover:bg-white/15"
              >
                <span className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <span>
                    <span className="block font-display text-lg font-semibold">Contact us</span>
                    <span className="block text-xs text-white/70">{data.contact.email}</span>
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function avatarColor(initials: string) {
  // deterministic hue from the initials
  let h = 0;
  for (let i = 0; i < initials.length; i++) h = (h * 31 + initials.charCodeAt(i)) % 360;
  return `hsl(${h} 60% 45%)`;
}

function PersonCard({ r }: { r: Researcher }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-soft">
      <div className="flex items-start gap-4">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white"
          style={{ background: avatarColor(r.initials) }}
        >
          {r.initials}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight">{r.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">{r.role}</p>
          <a
            href={`mailto:${r.email}`}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="h-3 w-3" />
            <span className="truncate">{r.email}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

function LeadCard({ r }: { r: Researcher }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-card via-card to-accent/5 p-7 shadow-soft">
      <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent-foreground">
        <Crown className="h-3 w-3" /> {r.tag}
      </span>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <span
          className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-white shadow-strong"
          style={{ background: avatarColor(r.initials) }}
        >
          {r.initials}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{r.name}</h3>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent">{r.role}</p>
          <a
            href={`mailto:${r.email}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Mail className="h-3.5 w-3.5" /> {r.email}
          </a>
        </div>
      </div>
    </article>
  );
}
