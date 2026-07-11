import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string; // last crumb has no href (current page)
}

/** Simple breadcrumb trail — reusable across inner pages. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-muted"
    >
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {i > 0 && <span aria-hidden>/</span>}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-primary">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
