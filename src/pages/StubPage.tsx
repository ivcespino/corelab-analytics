import { SiteHeader } from "@/components/SiteHeader";

interface Props {
  title: string;
  subtitle: string;
}

export function StubPage({ title, subtitle }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="grid min-h-screen place-items-center px-6 pt-24">
        <div className="max-w-xl text-center">
          <span className="section-eyebrow">Coming next</span>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
        </div>
      </main>
    </>
  );
}
