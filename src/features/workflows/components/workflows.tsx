"use client";

import { formatDistanceToNow } from "@/lib/format";
import {
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityPagination,
  EntitySearch,
  EmptyView,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { CreateWorkflowButton } from "./create-workflow-button";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useRemoveWorkflow, useWorkflows } from "../hooks/use-workflows";

export function WorkflowsList() {
  const [params, setParams] = useWorkflowsParams();
  const query = useWorkflows();
  const remove = useRemoveWorkflow();

  return (
    <EntityContainer>
      <EntityHeader
        title="Workflows"
        description="Create and manage your automation workflows."
        action={<CreateWorkflowButton />}
      />

      <EntitySearch
        value={params.search}
        onChange={(search) => setParams({ search, page: 1 })}
        placeholder="Search workflows..."
      />

      {query.isLoading ? (
        <LoadingView label="Loading workflows..." />
      ) : query.isError ? (
        <ErrorView message={query.error.message} />
      ) : query.data && query.data.items.length === 0 ? (
        <EmptyView
          title={params.search ? "No workflows match your search" : "No workflows yet"}
          description={
            params.search
              ? "Try a different search term."
              : "Create your first workflow to get started."
          }
          action={!params.search ? <CreateWorkflowButton /> : undefined}
        />
      ) : query.data ? (
        <>
          <div className="flex flex-col gap-2">
            {query.data.items.map((workflow) => (
              <EntityItem
                key={workflow.id}
                title={workflow.name}
                subtitle={`Updated ${formatDistanceToNow(workflow.updatedAt)} ago`}
                href={`/workflows/${workflow.id}`}
                onDelete={() => remove.mutate({ id: workflow.id })}
                deleteConfirmTitle="Delete workflow?"
                deleteConfirmDescription="This permanently removes the workflow and all its nodes and connections."
              />
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
