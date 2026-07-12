import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { OtpLoginForm } from "@/components/features/auth/OtpLoginForm";

export const metadata: Metadata = {
  title: "Patient Login",
  description: "Log in with your mobile number to see your appointments, prescriptions and payments.",
};

export default function PortalLoginPage() {
  return (
    <AuthCard
      title="Patient Portal"
      sub="Log in with the mobile number you use for appointments."
    >
      <Suspense>
        <OtpLoginForm />
      </Suspense>
    </AuthCard>
  );
}
