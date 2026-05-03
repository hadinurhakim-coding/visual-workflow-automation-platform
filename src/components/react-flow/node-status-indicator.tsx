import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NodeStatus = "initial" | "loading" | "success" | "error";

export function NodeStatusIndicator({
  status,
  children,
}: {
  status: NodeStatus;
  children: ReactNode;
}) {
  if (status === "initial") return <>{children}</>;

  return (
    <div className="relative">
      {status === "loading" ? (
        <>
          <style>{`
            @keyframes node-spin { to { transform: rotate(360deg); } }
            .node-loading-border::before {
              content: "";
              position: absolute;
              inset: -2px;
              border-radius: 8px;
              padding: 2px;
              background: conic-gradient(from 0deg, transparent 0deg, var(--primary) 90deg, transparent 180deg);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              animation: node-spin 1.2s linear infinite;
              pointer-events: none;
              z-index: 0;
            }
          `}</style>
          <div className="node-loading-border absolute inset-0 rounded-md" />
        </>
      ) : null}
      <div
        className={cn(
          "rounded-md",
          status === "success" && "ring-2 ring-emerald-500",
          status === "error" && "ring-2 ring-red-500",
        )}
      >
        {children}
      </div>
    </div>
  );
}
