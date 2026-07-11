import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PaymentBadges } from "@/components/ui/PaymentBadges";
import { CheckIcon } from "@/components/ui/icons";
import { formatTaka } from "@/lib/constants";
import type { ServiceDetail } from "@/lib/service-details";

/** Transparent pricing — reassurance copy + a detailed price card. */
export function ServicePricing({ service }: { service: ServiceDetail }) {
  return (
    <Container className="py-20">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal variant="up">
          <h2 className="mb-3.5 text-[28px] font-extrabold text-ink md:text-[32px]">
            Transparent Pricing
          </h2>
          <p className="mb-5 max-w-[480px] text-[16px] leading-[1.7] text-ink-muted">
            You will know the exact cost before treatment starts. The final fee
            depends on your specific case — we explain everything clearly first.
          </p>
          <p className="max-w-[480px] text-[16px] leading-[1.7] text-ink-muted">
            No hidden costs. No surprise charges at the end. Ever.
          </p>
        </Reveal>

        <Reveal variant="scale">
          <div className="rounded-2xl border border-primary-light bg-white p-8 shadow-lift">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary">
              {service.name}
            </div>
            <div className="mb-5 font-heading text-[32px] font-extrabold text-ink md:text-[36px]">
              {formatTaka(service.priceMin)} – {formatTaka(service.priceMax)}{" "}
              <span className="text-[15px] font-semibold text-ink-muted">
                {service.priceUnit}
              </span>
            </div>
            <div className="mb-[22px] flex flex-col gap-2.5">
              {service.includes.map((inc) => (
                <div
                  key={inc}
                  className="flex items-center gap-3 text-[15px] text-ink"
                >
                  <CheckIcon size={16} className="flex-none text-primary" />
                  {inc}
                </div>
              ))}
            </div>
            <div className="mb-5 rounded-xl bg-primary-light px-[18px] py-3.5 text-[14.5px] text-ink">
              💳 <strong>Installment payment available</strong> — pay per visit,
              not all at once.
            </div>
            <PaymentBadges />
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
