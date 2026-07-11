import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { ServicePreview } from "@/types";
import { formatTaka } from "@/lib/constants";

/** Service summary card — reused on Home and the Services listing page. */
export function ServiceCard({ service }: { service: ServicePreview }) {
  const href = `/services/${service.slug}`;
  return (
    <Card hoverable className="flex flex-col gap-3 p-6">
      <div className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-light font-heading text-[16px] font-extrabold text-primary">
          {service.glyph}
        </span>
        <h3 className="font-heading text-[17px] font-bold text-ink">
          {service.name}
        </h3>
      </div>
      <p className="text-[14.5px] leading-relaxed text-ink-muted">
        {service.desc}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-primary-light pt-2.5">
        <span className="text-sm text-ink-muted">
          Starting from{" "}
          <span className="font-heading text-[15px] font-bold text-primary">
            {formatTaka(service.feeFrom)}
          </span>
        </span>
        <Link
          href={href}
          className="font-heading text-[13.5px] font-bold text-primary hover:text-primary-dark"
        >
          Learn More →
        </Link>
      </div>
    </Card>
  );
}
