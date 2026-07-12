import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { getPublicClinicInfo } from "@/server/repositories/settings.repository";

/** Public marketing shell — Navbar + Footer + floating WhatsApp on every page. */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clinic = await getPublicClinicInfo();
  return (
    <>
      <Navbar clinicName={clinic.name} />
      <main>{children}</main>
      <Footer clinicName={clinic.name} address={clinic.address} phone={clinic.phoneDisplay} />
      <FloatingWhatsApp />
    </>
  );
}
