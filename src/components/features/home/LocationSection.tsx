import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PhoneIcon } from "@/components/ui/icons";
import { CLINIC, TEL_URL } from "@/lib/constants";

/** Location block — map placeholder, address, click-to-call, chamber hours. */
export function LocationSection() {
  return (
    <Container className="py-20 md:py-24">
      <h2 className="mb-11 text-[30px] font-extrabold text-ink md:text-[34px]">
        Find Us Easily
      </h2>
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Map placeholder */}
        <div className="relative flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-[#9EC9D6] bg-[repeating-linear-gradient(45deg,#E8F4F8,#E8F4F8_14px,#F4FAFC_14px,#F4FAFC_28px)]">
          <div className="rounded-lg bg-white px-4 py-2.5 font-mono text-[13px] text-ink-muted">
            [ Google Map embed — clinic location ]
          </div>
          <a
            href="#"
            className="absolute bottom-5 left-5 flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-heading text-sm font-bold text-white shadow-[0_6px_18px_rgba(14,124,123,0.35)] transition-colors hover:bg-primary-dark"
          >
            Get Directions →
          </a>
        </div>

        {/* Contact cards */}
        <div className="flex flex-col gap-4">
          <Card className="px-6 py-[22px]">
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
              Address
            </div>
            <div className="text-[15.5px] leading-[1.7] text-ink">
              {CLINIC.address}
            </div>
          </Card>

          <a href={TEL_URL} className="group">
            <Card hoverable className="flex items-center gap-4 px-6 py-[22px]">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-primary-light text-primary">
                <PhoneIcon size={20} />
              </span>
              <div>
                <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
                  Call Now
                </div>
                <div className="font-heading text-[19px] font-extrabold text-ink">
                  {CLINIC.phoneDisplay}
                </div>
              </div>
            </Card>
          </a>

          <Card className="px-6 py-[22px]">
            <div className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary">
              Chamber Hours
            </div>
            <div className="flex flex-col gap-2">
              {CLINIC.hours.map((h) => (
                <div
                  key={h.label}
                  className="flex justify-between text-[15px]"
                >
                  <span className={h.off ? "text-ink-muted" : "text-ink"}>
                    {h.label}
                  </span>
                  <span className="font-semibold text-ink">{h.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}
