import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-primary-light to-white px-5 text-center">
      <Logo />
      <div>
        <div className="font-heading text-[72px] font-extrabold leading-none text-primary/30">
          404
        </div>
        <h1 className="mt-2 font-heading text-[24px] font-extrabold text-ink">
          Page not found
        </h1>
        <p className="mx-auto mt-2 max-w-[380px] text-[15px] leading-[1.7] text-ink-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">
          Back to Home
        </Button>
        <Button href="/book" variant="cta">
          Book Appointment
        </Button>
      </div>
      <Link href="/contact" className="text-[14px] font-semibold text-primary underline">
        Need help? Contact us
      </Link>
    </div>
  );
}
