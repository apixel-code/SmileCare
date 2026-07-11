import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Centered empty/placeholder state — icon, title, message, optional action. */
export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon?: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary">
          {icon}
        </div>
      )}
      <h2 className="mb-3 text-[24px] font-extrabold text-ink md:text-[28px]">
        {title}
      </h2>
      {message && (
        <p className="mx-auto mb-7 max-w-[460px] text-[16px] leading-[1.7] text-ink-muted">
          {message}
        </p>
      )}
      {action}
    </Container>
  );
}
