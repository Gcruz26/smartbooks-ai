// components/BrandLogo.tsx
// Reusable brand mark for SmartBooks AI. Use this everywhere instead of
// hardcoding `<Image src="/smartbooks-logo-cropped.png" .../>`. Pick the size
// variant that matches the surface.
//
// Sizing strategy: WIDTH-based (height: auto + object-contain) so the
// logo's natural aspect ratio is always preserved and it never looks
// cramped. Each variant defines a responsive width ramp.

import Image from "next/image";
import { cn } from "@/lib/utils";

export type BrandLogoSize =
  | "small"     // compact spots (~110-130px wide)
  | "medium"    // generic mid-size brand mark (~150-170px)
  | "large"     // hero / showcase (~220-280px)
  | "sidebar"   // dashboard sidebar brand row (~150-170px)
  | "header"    // landing top nav, mid pages (~130-180px responsive)
  | "auth";     // login/signup brand (~180-220px)

const SIZE_CLASSES: Record<BrandLogoSize, string> = {
  small: "w-[110px] sm:w-[130px]",
  medium: "w-[150px] sm:w-[170px]",
  large: "w-[220px] sm:w-[260px] lg:w-[300px]",
  sidebar: "w-[150px] sm:w-[170px]",
  header: "w-[130px] sm:w-[150px] lg:w-[180px]",
  auth: "w-[180px] sm:w-[200px] lg:w-[220px]",
};

interface BrandLogoProps {
  /** Size variant, defaults to "medium". */
  size?: BrandLogoSize;
  /** Extra classes appended to the resolved variant. */
  className?: string;
  /**
   * Wrap the logo in a translucent panel suitable for dark backgrounds
   * (e.g. the navy gradient on the login left panel).
   */
  onDark?: boolean;
  /** Pass `priority` for logos above the fold (LCP). */
  priority?: boolean;
}

/**
 * Brand mark for SmartBooks AI. Renders the horizontal logo from
 * `public/smartbooks-logo.png` with `object-contain` + `h-auto` so the
 * width drives the size and the natural aspect ratio is preserved.
 */
export function BrandLogo({
  size = "medium",
  className,
  onDark,
  priority,
}: BrandLogoProps) {
  return (
    <Image
      src="/smartbooks-logo-cropped.png"
      alt="SmartBooks AI"
      width={1168}
      height={308}
      priority={priority}
      className={cn(
        "h-auto object-contain",
        SIZE_CLASSES[size],
        onDark && "rounded-xl bg-white/10 p-2 ring-1 ring-white/20",
        className
      )}
    />
  );
}
