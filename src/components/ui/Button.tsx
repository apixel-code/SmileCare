import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "cta" | "primary" | "outline" | "ghost" | "whatsapp";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  cta: "bg-cta text-white shadow-[0_8px_24px_rgba(255,122,89,0.35)] hover:bg-cta-dark",
  primary: "bg-primary text-white hover:bg-primary-dark",
  outline:
    "border-[1.5px] border-primary text-primary bg-white hover:bg-primary-light",
  ghost: "text-ink hover:text-primary bg-transparent",
  whatsapp:
    "border-[1.5px] border-whatsapp text-whatsapp bg-white hover:bg-[#F0FBF4]",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-12 px-4 text-sm", // 48px min touch target
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-[17px]",
};

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = BaseProps & {
  href: string;
  external?: boolean;
  "aria-label"?: string;
};

export type ButtonProps = AsButton | AsLink;

function classes(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-heading font-bold transition-colors whitespace-nowrap",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const cls = classes(
    props.variant ?? "primary",
    props.size ?? "md",
    props.className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, children } = props;
    if (props.external) {
      return (
        <a href={href} className={cls} aria-label={props["aria-label"]}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} aria-label={props["aria-label"]}>
        {children}
      </Link>
    );
  }

  // Strip non-DOM props; the rest (children, onClick, type...) spread onto <button>.
  const { variant, size, className, ...buttonProps } = props;
  return <button className={cls} {...buttonProps} />;
}
