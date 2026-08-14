import { Container } from "@/components/ui/Container";

/**
 * Centered page hero — elevated inner-page intro with brand texture.
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
    <section className="relative overflow-hidden bg-primary-light">
      <div className="absolute inset-0 surface-pattern opacity-70" aria-hidden />
      <Container className="relative py-16 text-center md:py-24 [&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
        <div
          className="mb-[18px] inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-primary shadow-soft"
          style={{ animationDelay: "0.05s" }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-cta" />
          {eyebrow}
        </div>
        <h1
          className="mx-auto mb-4 max-w-[840px] text-balance text-[36px] font-extrabold leading-tight text-ink md:text-[56px]"
          style={{ animationDelay: "0.15s" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mx-auto max-w-[650px] text-[18px] leading-[1.8] text-ink-muted"
            style={{ animationDelay: "0.25s" }}
          >
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
