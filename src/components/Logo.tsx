import { useTheme } from "@/hooks/useTheme";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Force a variant; otherwise follows the active theme. */
  variant?: "auto" | "light" | "dark";
  /** When false, renders only the square symbol mark (no wordmark). */
  showWordmark?: boolean;
}

/**
 * Theme-aware site mark. The PNG asset is a square symbol; the wordmark is
 * rendered as text next to it so it scales crisply at any size.
 *  - light mode → navy symbol (`logo-light.png`)
 *  - dark mode  → cyan symbol (`logo-dark.png`)
 */
export function Logo({ className, variant = "auto", showWordmark = true }: Props) {
  const { theme } = useTheme();
  const resolved = variant === "auto" ? theme : variant;
  const src = resolved === "dark" ? logoDark : logoLight;
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <img
        src={src}
        alt="CoreLab Analytics"
        className="h-full w-auto aspect-square object-contain"
        draggable={false}
      />
      {showWordmark && (
        <span className="font-display text-[15px] font-bold tracking-tight leading-none">
          <span className="text-foreground">CoreLab</span>{" "}
          <span className="text-muted-foreground font-medium">Analytics</span>
        </span>
      )}
    </span>
  );
}
