import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/features/auth/AuthCard";
import { StaffLoginForm } from "@/components/features/auth/StaffLoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  description: "SmileCare clinic staff login.",
};

export default function AdminLoginPage() {
  return (
    <AuthCard title="Clinic Admin" sub="Staff members only. Log in to continue.">
      <Suspense>
        <StaffLoginForm />
      </Suspense>
    </AuthCard>
  );
}
