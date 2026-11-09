import Image from "next/image";
import { cn } from "@/lib/utils";
import art from "../../../public/art/suv-watercolour.webp";

/* The signature watercolour: an original, hand-built illustration of a
   contemporary SUV, rendered as a static optimised asset. */
export function HeroArt({ className, priority = true, sizes }: { className?: string; priority?: boolean; sizes?: string }) {
  return (
    <Image
      src={art}
      alt="Watercolour illustration of a contemporary SUV in deep forest green on warm ivory paper"
      priority={priority}
      sizes={sizes ?? "(min-width: 1024px) 60vw, 100vw"}
      className={cn("h-auto w-full select-none", className)}
      draggable={false}
    />
  );
}
