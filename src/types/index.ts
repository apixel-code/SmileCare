/** Shared app types. Domain models live alongside Mongoose schemas later. */

export interface ServicePreview {
  slug: string;
  glyph: string;
  name: string;
  desc: string;
  feeFrom: number;
  image: string;
}

export interface TrustItem {
  glyph: string;
  big: string;
  small: string;
}

export interface WhyCard {
  glyph: string;
  title: string;
  desc: string;
}

export interface Review {
  name: string;
  area: string;
  text: string;
  avatar: string;
}
