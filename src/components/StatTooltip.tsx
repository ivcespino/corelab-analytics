import { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GLOSSARY } from "@/lib/glossary";
import { cn } from "@/lib/utils";

interface Props {
  /** Glossary key (preferred) */
  termKey?: keyof typeof GLOSSARY;
  /** Or pass explicit content */
  title?: string;
  body?: string;
  /** Custom trigger (defaults to dotted-underline children or a help icon) */
  children?: ReactNode;
  className?: string;
  iconOnly?: boolean;
}

/**
 * Hoverable / focusable definition badge.
 *
 * Renders a real <button> as the trigger so hover and focus work reliably
 * even when nested inside a <Label> (which captures clicks for its input).
 */
export function StatTooltip({ termKey, title, body, children, className, iconOnly }: Props) {
  const entry = termKey ? GLOSSARY[termKey] : undefined;
  const heading = title ?? entry?.term ?? "";
  const detail = body ?? entry?.detail ?? entry?.short ?? "";
  const short = entry?.short ?? body ?? "";

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        <button
          type="button"
          // Stop label clicks from bubbling to the associated input.
          onClick={(e) => e.preventDefault()}
          aria-label={`Definition: ${heading}`}
          className={cn(
            "group inline-flex items-center gap-1 align-baseline cursor-help bg-transparent p-0 text-left",
            !iconOnly &&
              "decoration-dotted decoration-accent/70 underline underline-offset-[3px] decoration-[1.5px] hover:decoration-accent",
            className,
          )}
        >
          {children ?? (iconOnly ? null : heading)}
          <HelpCircle
            className={cn(
              "shrink-0 text-muted-foreground/70 transition-colors group-hover:text-accent",
              iconOnly ? "h-3.5 w-3.5" : "h-3 w-3",
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs text-xs leading-relaxed"
        sideOffset={6}
      >
        <p className="font-display text-[13px] font-bold text-foreground">{heading}</p>
        {short && short !== detail && (
          <p className="mt-0.5 text-foreground/90">{short}</p>
        )}
        {detail && <p className="mt-1 text-muted-foreground">{detail}</p>}
      </TooltipContent>
    </Tooltip>
  );
}
