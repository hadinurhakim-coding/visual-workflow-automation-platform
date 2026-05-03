import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { ExecutionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const config: Record<
  ExecutionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  RUNNING: {
    label: "Running",
    variant: "secondary",
    icon: Loader2,
    className: "text-blue-600",
  },
  SUCCESS: {
    label: "Success",
    variant: "outline",
    icon: CheckCircle2,
    className: "border-emerald-500 text-emerald-600",
  },
  FAILED: {
    label: "Failed",
    variant: "destructive",
    icon: XCircle,
    className: "",
  },
};

export function ExecutionStatusBadge({ status }: { status: ExecutionStatus }) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <Badge variant={c.variant} className={c.className}>
      <Icon
        className={`mr-1 h-3 w-3 ${status === "RUNNING" ? "animate-spin" : ""}`}
      />
      {c.label}
    </Badge>
  );
}
