import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { BOOK_HREF } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Dental Health Blog",
  description:
    "Simple, trustworthy dental health tips and guides from SmileCare Dental Clinic.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Coming Soon"
        title="Dental Health Blog"
        subtitle="Simple, honest advice to keep your family's smiles healthy — articles are on the way."
        backgroundImage="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1920&q=85"
      />
      <EmptyState
        icon={<span className="font-heading text-[26px] font-extrabold">✎</span>}
        title="We're writing our first articles"
        message="Soon you'll find easy-to-read guides on painless treatments, dental care tips, and answers to common worries. In the meantime, have a question? We're happy to help."
        action={
          <Button href={BOOK_HREF} variant="cta" size="lg">
            Book an Appointment
          </Button>
        }
      />
    </>
  );
}
