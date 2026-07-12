import type { Metadata } from "next";

/** Clinic admin group — private area, keep out of search engines. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
