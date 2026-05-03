"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { formatDuration } from "@/lib/format";
import { useExecution } from "../hooks/use-executions";
import { ExecutionStatusBadge } from "./execution-status-badge";

export function ExecutionDetail({ id }: { id: string }) {
  const query = useExecution(id);

  if (query.isLoading) return <LoadingView label="Loading execution..." />;
  if (query.isError) return <ErrorView message={query.error.message} />;
  if (!query.data) return null;

  const execution = query.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/executions">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Executions
          </Link>
        </Button>
        <ExecutionStatusBadge status={execution.status} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Run details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground text-xs">Workflow</dt>
              <dd>
                <Link
                  href={`/workflows/${execution.workflow.id}`}
                  className="hover:underline"
                >
                  {execution.workflow.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Inngest event id</dt>
              <dd className="font-mono text-xs break-all">
                {execution.inngestEventId}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Started</dt>
              <dd>{new Date(execution.startedAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Completed</dt>
              <dd>
                {execution.completedAt
                  ? new Date(execution.completedAt).toLocaleString()
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Duration</dt>
              <dd>
                {formatDuration(execution.startedAt, execution.completedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {execution.error ? (
        <Card className="border-destructive/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-destructive text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-destructive text-sm">{execution.error}</p>
            {execution.errorStack ? (
              <details className="text-xs">
                <summary className="text-muted-foreground cursor-pointer">
                  Stack trace
                </summary>
                <pre className="bg-muted/40 mt-2 overflow-x-auto rounded-md p-3 text-xs">
                  {execution.errorStack}
                </pre>
              </details>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {execution.output ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted/40 overflow-x-auto rounded-md p-3 text-xs">
              {JSON.stringify(execution.output, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
