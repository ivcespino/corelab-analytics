import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { TocDropdown, type TocItem } from "@/components/TocDropdown";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  BackgroundTwoBeatSection,
  VariablesSection,
  ResearchQuestionsSection,
  SignificanceSection,
  BeneficiariesSection,
  LiteratureSection,
  FrameworkSection,
} from "@/components/sections/ResearchSections";
import { FinaleSection } from "@/components/sections/FinaleSection";

interface Content {
  hero: any;
  sections: any[];
  finale: any;
}

const Index = () => {
  const [content, setContent] = useState<Content | null>(null);
  const [activeId, setActiveId] = useState("hero");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/content.json").then((r) => r.json()).then(setContent).catch(console.error);
  }, []);

  const tocItems: TocItem[] = useMemo(() => {
    if (!content) return [];
    return [
      { id: "hero", label: "Overview", chapter: "Chapter 1" },
      ...content.sections.map((s) => ({ id: s.id, label: s.eyebrow, chapter: s.chapter })),
      { id: "finale", label: "Continue", chapter: "Continue" },
    ];
  }, [content]);

  useEffect(() => {
    if (!content || !containerRef.current) return;
    const root = containerRef.current;
    const sections = root.querySelectorAll<HTMLElement>(".snap-section");
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [content]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!content) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="font-display text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div ref={containerRef} className="snap-container">
        <HeroSection data={content.hero} />
        {content.sections.map((s, i) => {
          const variant: "odd" | "even" = i % 2 === 0 ? "even" : "odd";
          switch (s.template) {
            case "background2":   return <BackgroundTwoBeatSection key={s.id} data={s} variant={variant} />;
            case "variables":     return <VariablesSection key={s.id} data={s} variant={variant} />;
            case "rq":            return <ResearchQuestionsSection key={s.id} data={s} variant={variant} />;
            case "significance":  return <SignificanceSection key={s.id} data={s} variant={variant} />;
            case "beneficiaries": return <BeneficiariesSection key={s.id} data={s} variant={variant} />;
            case "literature":    return <LiteratureSection key={s.id} data={s} variant={variant} />;
            case "framework":     return <FrameworkSection key={s.id} data={s} variant={variant} />;
            default:              return null;
          }
        })}
        <FinaleSection data={content.finale} onBackToTop={() => jumpTo("hero")} />
      </div>
      <TocDropdown items={tocItems} activeId={activeId} onJump={jumpTo} />
    </>
  );
};

export default Index;
