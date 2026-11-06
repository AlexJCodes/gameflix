import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex min-h-12 items-center justify-center rounded-md border px-5 font-body text-button font-bold text-center motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:border-divider disabled:bg-surface-elevated disabled:text-muted";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-brand bg-brand text-background enabled:hover:border-brand-hover enabled:hover:bg-brand-hover",
  secondary: "border-divider bg-surface text-foreground enabled:hover:bg-surface-elevated",
  danger: "border-danger bg-surface text-danger enabled:hover:bg-surface-elevated",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
