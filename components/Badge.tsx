"use client";

import { SELECTION } from "@/lib/constants";

export type BadgeVariant = "default" | "selected";

export type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  onClick?: () => void;
  className?: string;
};

export function Badge({
  children,
  variant = "default",
  onClick,
  className = "",
}: BadgeProps) {
  const variantClasses =
    variant === "selected" ? SELECTION.BADGE_SELECTED : SELECTION.BADGE_DEFAULT;

  const interactiveClasses = onClick
    ? "cursor-pointer hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
    : "";

  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs ${variantClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
