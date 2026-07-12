/**
 * DRY motion system — interaction presets + the ONE rhythm used everywhere.
 * Change hover/press feel or stagger tempo in ONE place.
 * All respect prefers-reduced-motion.
 */

// ── Rhythm ──────────────────────────────────────────────────────────
/** Beat between staggered siblings (ms). The whole site follows this tempo. */
export const STAGGER_MS = 100;

/**
 * Stagger delay for the i-th item in a group, wrapped every `wrap` items so
 * elements that enter the viewport later never wait a long queue of delays
 * (index-based delays apply AFTER intersection). Use `wrap` = column count
 * for grids; default 4 caps any delay at 300ms.
 */
export function stagger(index: number, wrap = 4): number {
  return (index % wrap) * STAGGER_MS;
}

/** Cards: gentle lift + deeper soft shadow on hover. */
export const CARD_HOVER =
  "transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-soft-md motion-reduce:transition-none motion-reduce:hover:translate-y-0";

/** Buttons / pressable elements: subtle lift on hover, press-in on active. */
export const PRESSABLE =
  "transition-all duration-200 ease-smooth hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none";

/** Small inline links / icon buttons: quick color+scale nudge. */
export const NUDGE =
  "transition-transform duration-200 ease-smooth hover:scale-105 active:scale-95 motion-reduce:transform-none";
