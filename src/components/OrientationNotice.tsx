import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Monitor, X } from "lucide-react";

const SNAP_ROUTES = ["/", "/dashboard"];
const STORAGE_KEY = "corelab-orientation-dismissed";

function shouldShow() {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const portrait = h > w;
  return w < 900 || (portrait && w < 1100);
}

export function OrientationNotice() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!SNAP_ROUTES.includes(pathname)) {
      setOpen(false);
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    const evaluate = () => setOpen(shouldShow());
    evaluate();
    window.addEventListener("resize", evaluate);
    window.addEventListener("orientationchange", evaluate);
    return () => {
      window.removeEventListener("resize", evaluate);
      window.removeEventListener("orientationchange", evaluate);
    };
  }, [pathname]);

  if (!open) return null;

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-background/80 px-5 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-accent/40 bg-card p-6 shadow-strong">
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Monitor className="h-6 w-6" />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold leading-tight">
          Best viewed on a larger screen
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          CoreLab Analytics uses full-page slides— it works best on a landscape tablet or desktop. You can keep going on this device, but content may feel cramped.
        </p>
        <button
          onClick={dismiss}
          className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 dark:bg-accent dark:text-accent-foreground"
        >
          Got it, continue anyway
        </button>
      </div>
    </div>
  );
}
