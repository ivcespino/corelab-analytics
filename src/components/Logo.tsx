import { useTheme } from "@/hooks/useTheme";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  /** Force a variant; otherwise follows the active theme. */
  variant?: "auto" | "light" | "dark";
}

/**
 * Theme-aware site mark. Renders `logo-light.svg` in light mode and
 * `logo-dark.svg` in dark mode. Drop replacement assets at the same paths.
 */
export function Logo({ className, variant = "auto" }: Props) {
  const { theme } = useTheme();
  const resolved = variant === "auto" ? theme : variant;
  const src = resolved === "dark" ? logoDark : logoLight;
  return (
    <img
      src={src}
      alt="CoreLab Analytics"
      className={cn("h-8 w-auto select-none", className)}
      draggable={false}
    />
  );
}
