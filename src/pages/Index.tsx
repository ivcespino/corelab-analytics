import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { TocDropdown, type TocItem } from "@/components/TocDropdown";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  BackgroundSection,
  ProblemSection,
  ObjectivesSection,
  HypothesesSection,
} from "@/components/sections/ContentSections";
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
    fetch("/content.json")
      .then((r) => r.json())
      .then(setContent)
      .catch((e) => console.error("Failed to load content.json", e));
  }, []);

  // Build TOC from rendered DOM (after content mount)
  const tocItems: TocItem[] = useMemo(() => {
    if (!content) return [];
    const items: TocItem[] = [
      { id: "hero", label: "Overview", chapter: "Chapter 1" },
      ...content.sections.map((s) => ({
        id: s.id,
        label: s.eyebrow,
        chapter: s.chapter,
      })),
      { id: "finale", label: "Continue", chapter: "Continue" },
    ];
    return items;
  }, [content]);

  // Observe sections for active TOC highlighting
  useEffect(() => {
    if (!content || !containerRef.current) return;
    const root = containerRef.current;
    const sections = root.querySelectorAll<HTMLElement>(".snap-section");

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { root, threshold: [0.4, 0.6, 0.8] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [content]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          const variant = i % 2 === 0 ? "even" : "odd";
          switch (s.id) {
            case "background":
              return <BackgroundSection key={s.id} data={s} variant={variant} />;
            case "problem":
              return <ProblemSection key={s.id} data={s} variant={variant} />;
            case "objectives":
              return <ObjectivesSection key={s.id} data={s} variant={variant} />;
            case "hypotheses":
              return <HypothesesSection key={s.id} data={s} variant={variant} />;
            default:
              return null;
          }
        })}
        <FinaleSection data={content.finale} onBackToTop={() => jumpTo("hero")} />
      </div>
      <TocDropdown items={tocItems} activeId={activeId} onJump={jumpTo} />
    </>
  );
};

export default Index;
