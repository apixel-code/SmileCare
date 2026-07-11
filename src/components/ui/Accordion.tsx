/**
 * FAQ accordion — native <details> so answers stay in the DOM (SEO/AEO) and it
 * works without JS. `name` makes items mutually exclusive (one open at a time).
 * Reusable across service detail, Problems, and other FAQ sections.
 */
export interface AccordionItem {
  q: string;
  a: string;
}

export function Accordion({
  items,
  name = "faq",
  defaultOpenIndex = 0,
}: {
  items: AccordionItem[];
  name?: string;
  defaultOpenIndex?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={item.q}
          name={name}
          open={i === defaultOpenIndex}
          className="group overflow-hidden rounded-2xl border border-primary-light bg-white shadow-soft transition-colors open:border-primary/40"
        >
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-[22px] py-[18px] font-heading text-[16px] font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              aria-hidden
              className="flex-none text-[22px] font-normal leading-none text-primary"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="animate-fade-in px-[22px] pb-5 text-[15px] leading-[1.75] text-ink-muted">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
