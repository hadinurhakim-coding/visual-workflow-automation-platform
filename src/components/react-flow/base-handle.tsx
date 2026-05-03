import { Handle, type HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export function BaseHandle({ className, ...props }: HandleProps) {
  return (
    <Handle
      {...props}
      className={cn(
        "!bg-primary !border-background !h-3 !w-3 !border-2",
        className,
      )}
    />
  );
}
