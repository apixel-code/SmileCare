import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import type { ServicePreview } from "@/types";
import { formatTaka } from "@/lib/constants";

/** Service summary card — reused on Home and the Services listing page. */
export function ServiceCard({ service }: { service: ServicePreview }) {
  const href = `/services/${service.slug}`;
  return (
    <Card hoverable className="group flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-primary-light">
        <Image
          src={service.image}
          alt={`${service.name} dental treatment`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 font-heading text-[15px] font-extrabold text-primary shadow-soft backdrop-blur-md">
          {service.glyph}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-cta px-3 py-1.5 font-heading text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(255,122,89,0.28)]">
          From {formatTaka(service.feeFrom)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-[17px] font-bold text-ink">
          {service.name}
        </h3>
      <p className="text-[14.5px] leading-relaxed text-ink-muted">
        {service.desc}
      </p>
      <div className="mt-auto flex items-center justify-between border-t border-primary-light pt-3">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
          Painless care
        </span>
        <Link
          href={href}
          className="font-heading text-[13.5px] font-bold text-primary hover:text-primary-dark"
        >
          Learn More →
        </Link>
      </div>
      </div>
    </Card>
  );
}
