import type { Metadata } from "next";

/** Patient portal group — private area, keep out of search engines. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
