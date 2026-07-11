import { Container } from "@/components/ui/Container";

/**
 * Centered page hero — sky→white gradient, dashed eyebrow, title + subtitle.
 * Reused across inner marketing pages (Services, Problems, Doctor...).
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-gradient-to-b from-primary-light to-white">
      <Container className="py-16 text-center md:py-[72px]">
        <div className="mb-[18px] inline-flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-primary">
          <span className="inline-block h-[2px] w-6 bg-primary" />
          {eyebrow}
          <span className="inline-block h-[2px] w-6 bg-primary" />
        </div>
        <h1 className="mb-4 text-[32px] font-extrabold text-ink md:text-[44px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-[560px] text-[18px] leading-[1.7] text-ink-muted">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
