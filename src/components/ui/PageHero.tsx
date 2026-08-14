import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Centered page hero — supports high-res clinic background imagery or light texture.
 * Reused across inner pages (Services, Blog, Contact, Problems...).
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  backgroundImage,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}) {
  const hasBg = !!backgroundImage;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        hasBg ? "bg-ink" : "bg-primary-light",
      )}
    >
      {hasBg ? (
        <>
          <Image
            src={backgroundImage}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="animate-hero-zoom object-cover opacity-60 motion-reduce:animate-none"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[rgba(8,28,39,0.75)] via-[rgba(10,45,58,0.65)] to-[rgba(8,28,39,0.85)]"
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 surface-pattern opacity-70" aria-hidden />
      )}

      <Container className="relative py-16 text-center md:py-24 [&>*]:animate-fade-up motion-reduce:[&>*]:animate-none">
        <div
          className={cn(
            "mb-[18px] inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] shadow-soft backdrop-blur-md",
            hasBg
              ? "border border-white/20 bg-white/12 text-[#86E4E2]"
              : "bg-white text-primary",
          )}
          style={{ animationDelay: "0.05s" }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-cta" />
          {eyebrow}
        </div>
        <h1
          className={cn(
            "mx-auto mb-4 max-w-[840px] text-balance text-[36px] font-extrabold leading-tight md:text-[54px]",
            hasBg ? "text-white" : "text-ink",
          )}
          style={{ animationDelay: "0.15s" }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mx-auto max-w-[650px] text-[17px] leading-[1.8] md:text-[19px]",
              hasBg ? "text-white/85" : "text-ink-muted",
            )}
            style={{ animationDelay: "0.25s" }}
          >
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
