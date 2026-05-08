import { List, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  chapter: string;
}

interface Props {
  items: TocItem[];
  activeId: string;
  onJump: (id: string) => void;
}

export function TocDropdown({ items, activeId, onJump }: Props) {
  const [open, setOpen] = useState(false);

  // Group by chapter, preserving insertion order
  const grouped = items.reduce<Record<string, TocItem[]>>((acc, it) => {
    (acc[it.chapter] ??= []).push(it);
    return acc;
  }, {});

  return (
    <>
      <button
        className="toc-fab"
        aria-label="Table of contents"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 flex w-72 flex-col rounded-2xl border bg-popover shadow-strong fade-up"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          <p className="shrink-0 px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Table of Contents
          </p>
          <div
            className="flex-1 space-y-4 overflow-y-auto px-3 pb-4 pt-1"
            style={{ overscrollBehavior: "contain" }}
          >
            {Object.entries(grouped).map(([chapter, chItems]) => (
              <div key={chapter}>
                <p className="mb-1.5 border-b border-border/60 px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                  {chapter}
                </p>
                <ul className="space-y-0.5">
                  {chItems.map((it) => {
                    const active = it.id === activeId;
                    return (
                      <li key={it.id}>
                        <button
                          onClick={() => {
                            onJump(it.id);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "text-foreground hover:bg-secondary"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              active ? "bg-accent" : "bg-muted-foreground/40"
                            )}
                          />
                          <span className="truncate">{it.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
