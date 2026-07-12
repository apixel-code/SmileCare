import Link from "next/link";
import Image from "next/image";
import type { ServicePreview } from "@/types";
import { formatTaka } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CARD_HOVER } from "@/lib/motion";

/** Image-topped service card for the Services listing page. */
export function ServiceGridCard({ service }: { service: ServicePreview }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border border-primary-light bg-white text-ink shadow-soft",
        CARD_HOVER,
        "hover:border-primary",
      )}
    >
      <div className="relative h-[190px] w-full overflow-hidden bg-primary-light">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 font-heading text-[15px] font-extrabold text-primary shadow-soft backdrop-blur-md">
          {service.glyph}
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-cta px-3 py-1.5 font-heading text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(255,122,89,0.28)]">
          From {formatTaka(service.feeFrom)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="font-heading text-[18px] font-bold">{service.name}</h3>
        <p className="text-[14.5px] leading-[1.7] text-ink-muted">
          {service.desc}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-primary-light pt-3">
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Treatment details
          </span>
          <span className="inline-flex items-center gap-1.5 font-heading text-[13.5px] font-bold text-primary">
            Learn More <span className="text-[16px]">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
