import Link from "next/link";
import Image from "next/image";
import type { ServicePreview } from "@/types";
import { formatTaka } from "@/lib/constants";

/** Image-topped service card for the Services listing page. */
export function ServiceGridCard({ service }: { service: ServicePreview }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-primary-light bg-white text-ink shadow-soft transition-all hover:border-primary hover:shadow-soft-md"
    >
      <div className="relative h-[150px] w-full bg-primary-light">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-[22px]">
        <h3 className="font-heading text-[18px] font-bold">{service.name}</h3>
        <p className="text-[14.5px] leading-[1.7] text-ink-muted">
          {service.desc}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-primary-light pt-3">
          <span className="text-[13.5px] text-ink-muted">
            From{" "}
            <span className="font-heading text-[15px] font-bold text-primary">
              {formatTaka(service.feeFrom)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 font-heading text-[13.5px] font-bold text-primary">
            Learn More <span className="text-[16px]">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
