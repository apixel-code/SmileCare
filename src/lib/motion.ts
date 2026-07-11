/**
 * DRY interaction presets — reused by Button, Card, ServiceGridCard, etc.
 * Change hover/press feel in ONE place. All respect prefers-reduced-motion.
 */

/** Cards: gentle lift + deeper soft shadow on hover. */
export const CARD_HOVER =
  "transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-soft-md motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Buttons / pressable elements: subtle lift on hover, press-in on active. */
export const PRESSABLE =
  "transition-all duration-200 ease-smooth hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none";

/** Small inline links / icon buttons: quick color+scale nudge. */
export const NUDGE =
  "transition-transform duration-200 ease-smooth hover:scale-105 active:scale-95 motion-reduce:transform-none";
