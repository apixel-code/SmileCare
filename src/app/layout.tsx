import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { CLINIC } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const heading = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const DESCRIPTION =
  "Pain-free, modern, and affordable dental care for your whole family. Book your appointment online in 2 minutes.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${CLINIC.name} — Pain-Free Modern Dental Care`,
    template: `%s | ${CLINIC.shortName}`,
  },
  description: DESCRIPTION,
  keywords: [
    "dentist Dhaka",
    "dental clinic",
    "root canal",
    "scaling polishing",
    "braces",
    "teeth whitening",
    "painless dentistry",
    CLINIC.name,
  ],
  openGraph: {
    type: "website",
    siteName: CLINIC.name,
    title: `${CLINIC.name} — Pain-Free Modern Dental Care`,
    description: DESCRIPTION,
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${CLINIC.name} — Pain-Free Modern Dental Care`,
    description: DESCRIPTION,
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
