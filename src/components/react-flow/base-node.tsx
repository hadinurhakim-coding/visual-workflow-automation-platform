import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BaseNode({
  children,
  className,
  selected,
}: {
  children: ReactNode;
  className?: string;
  selected?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative flex min-w-48 items-center gap-3 rounded-md border px-4 py-3 shadow-sm transition-colors",
        selected && "border-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}
