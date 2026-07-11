import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import type { ServiceDetail } from "@/lib/service-details";

/**
 * Before/after transformations. Uses styled placeholders (real patient photos
 * come from Cloudinary before launch — never stock for medical results).
 */
export function BeforeAfterGallery({ service }: { service: ServiceDetail }) {
  return (
    <section className="bg-primary-light">
      <Container className="py-[72px]">
        <Reveal variant="up">
          <h2 className="mb-3 text-center text-[28px] font-extrabold text-ink md:text-[32px]">
            Real Smile Transformations
          </h2>
          <p className="mx-auto mb-11 max-w-[480px] text-center text-[16px] leading-[1.7] text-ink-muted">
            Results from our own patients. Your smile can look like this too.
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.gallery.map((pair, i) => (
            <Reveal key={pair.caption} variant="up" delay={i * 100} className="h-full">
              <Card className="h-full overflow-hidden p-0">
                <div className="grid grid-cols-2">
                  <GalleryPane label="BEFORE" labelClass="bg-ink/85" />
                  <GalleryPane label="AFTER" labelClass="bg-primary" />
                </div>
                <div className="px-5 py-4 text-[14px] leading-[1.6] text-ink-muted">
                  {pair.caption}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function GalleryPane({
  label,
  labelClass,
}: {
  label: string;
  labelClass: string;
}) {
  return (
    <div className="relative h-[170px] bg-[repeating-linear-gradient(45deg,#DCE9EF,#DCE9EF_12px,#E8F4F8_12px,#E8F4F8_24px)]">
      <span
        className={`absolute bottom-2.5 left-2.5 rounded-md px-2.5 py-1 font-heading text-[11px] font-bold tracking-[0.05em] text-white ${labelClass}`}
      >
        {label}
      </span>
    </div>
  );
}
