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

export interface ProblemSolution {
  pain: string; // patient's own words
  treatment: string;
  reassure: string;
  feeFrom: number;
  slug: string; // related service
}

export interface MythFact {
  myth: string;
  fact: string;
}

export interface DoctorStat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export interface EducationEntry {
  year: string;
  title: string;
  place: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

export interface ScheduleRow {
  day: string;
  time: string;
  tone: "primary" | "muted" | "cta";
}
