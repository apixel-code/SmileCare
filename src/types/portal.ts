/** Serializable portal view-models (server → client components). */

export interface FamilyMember {
  id: string;
  name: string;
  age?: number;
}

export interface PortalAppointment {
  id: string;
  serialNo: number;
  date: string; // YYYY-MM-DD
  dateLabel: string; // "Sat, 18 Jul"
  timeSlot: string;
  serviceName: string;
  doctorName: string;
  status: string;
}

export interface PortalPayment {
  id: string;
  label: string;
  dateLabel: string;
  amount: number;
  method: string; // bkash | nagad | cash | card
  isDue: boolean;
}

export interface PortalPrescriptionSummary {
  id: string;
  dateLabel: string;
  diagnosis?: string;
  doctorName: string;
  medicineCount: number;
}

export interface MemberDashboard {
  member: FamilyMember;
  nextAppointment: PortalAppointment | null;
  history: PortalAppointment[];
  payments: PortalPayment[];
  prescriptions: PortalPrescriptionSummary[];
}
