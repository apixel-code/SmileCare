"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";
import { Button } from "@/components/ui/Button";

export function LogoutButton({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await logout();
        router.push(redirectTo);
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
