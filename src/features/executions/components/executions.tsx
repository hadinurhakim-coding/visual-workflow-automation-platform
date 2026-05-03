"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { formatDistanceToNow, formatDuration } from "@/lib/format";
import { useExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { ExecutionStatusBadge } from "./execution-status-badge";

export function ExecutionsList() {
  const [params, setParams] = useExecutionsParams();
  const query = useExecutions();

  return (
    <EntityContainer>
      <EntityHeader
        title="Executions"
        description="History of every workflow run, including their output and errors."
      />

      {query.isLoading ? (
        <LoadingView label="Loading executions..." />
      ) : query.isError ? (
        <ErrorView message={query.error.message} />
      ) : query.data && query.data.items.length === 0 ? (
        <EmptyView
          title="No executions yet"
          description="Run a workflow to see its execution history here."
        />
      ) : query.data ? (
        <>
          <div className="flex flex-col gap-2">
            {query.data.items.map((execution) => (
              <Link
                key={execution.id}
                href={`/executions/${execution.id}`}
                className="block"
              >
                <Card className="hover:bg-accent/30 transition-colors">
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {execution.workflow.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        Started {formatDistanceToNow(execution.startedAt)} ago
                        {" · "}
                        Duration{" "}
                        {formatDuration(execution.startedAt, execution.completedAt)}
                      </p>
                    </div>
                    <ExecutionStatusBadge status={execution.status} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <EntityPagination
            page={params.page}
            pageSize={params.pageSize}
            totalCount={query.data.totalCount}
            onPageChange={(page) => setParams({ page })}
          />
        </>
      ) : null}
    </EntityContainer>
  );
}
