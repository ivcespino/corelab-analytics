import { ReactNode, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  panels: ReactNode[];
  ariaLabel?: string;
}

/** Horizontal swipe / scroll carousel that lives inside one full-page snap.
 *  Uses a horizontally scroll-snapping flex track + arrow chevrons + dot pagination. */
export function SwipeCarousel({ panels, ariaLabel = "Carousel" }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      setActive(i);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative w-full" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((p, i) => (
          <div
            key={i}
            className="w-full flex-shrink-0 snap-center px-1"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${panels.length}`}
          >
            {p}
          </div>
        ))}
      </div>

      {/* Arrows— hidden on first/last edge */}
      {active > 0 && (
        <button
          onClick={() => goTo(active - 1)}
          className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full border bg-card/80 p-2 shadow-soft backdrop-blur hover:bg-card md:flex"
          aria-label="Previous panel"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {active < panels.length - 1 && (
        <button
          onClick={() => goTo(active + 1)}
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border bg-card/80 p-2 shadow-soft backdrop-blur hover:bg-card md:flex"
          aria-label="Next panel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Dot pagination */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {panels.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to panel ${i + 1}`}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-8 bg-accent" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
            )}
          />
        ))}
      </div>

      {/* Mobile swipe hint */}
      <p className="mt-2 text-center text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:hidden">
        Swipe →
      </p>
    </div>
  );
}
