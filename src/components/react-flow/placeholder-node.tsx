import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PlaceholderNode({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "bg-muted/30 hover:bg-muted/50 text-muted-foreground flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-sm transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}
