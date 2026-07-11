/** Shared navigation config — used by Navbar and Footer (DRY). */

export interface NavLink {
  label: string;
  href: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About Doctor", href: "/doctor" },
  { label: "Problems We Solve", href: "/problems" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_SERVICE_LINKS: NavLink[] = [
  { label: "Scaling & Polishing", href: "/services/scaling-polishing" },
  { label: "Root Canal Treatment", href: "/services/root-canal" },
  { label: "Dental Crown & Bridge", href: "/services/crown-bridge" },
  { label: "Braces & Orthodontics", href: "/services/braces-orthodontics" },
];

export const BOOK_HREF = "/book";
