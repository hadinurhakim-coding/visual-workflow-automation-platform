"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { formatDistanceToNow } from "@/lib/format";
import { useCredentials, useRemoveCredential } from "../hooks/use-credentials";
import { useCredentialsParams } from "../hooks/use-credentials-params";

const TYPE_LABEL: Record<string, string> = {
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic",
  GEMINI: "Google Gemini",
};

function NewCredentialButton() {
  return (
    <Button asChild>
      <Link href="/credentials/new">
        <Plus className="mr-1 h-4 w-4" />
        New Credential
      </Link>
    </Button>
  );
}

export function CredentialsList() {
  const [params, setParams] = useCredentialsParams();
  const query = useCredentials();
  const remove = useRemoveCredential();

  return (
    <EntityContainer>
      <EntityHeader
        title="Credentials"
        description="Encrypted API keys used by AI nodes (OpenAI, Anthropic, Gemini)."
        action={<NewCredentialButton />}
      />

      <EntitySearch
        value={params.search}
        onChange={(search) => setParams({ search, page: 1 })}
        placeholder="Search credentials..."
      />

      {query.isLoading ? (
        <LoadingView label="Loading credentials..." />
      ) : query.isError ? (
        <ErrorView message={query.error.message} />
      ) : query.data && query.data.items.length === 0 ? (
        <EmptyView
          title={params.search ? "No credentials match your search" : "No credentials yet"}
          description={
            params.search
              ? "Try a different search term."
              : "Add an API key to use AI nodes in your workflows."
          }
          action={!params.search ? <NewCredentialButton /> : undefined}
        />
      ) : query.data ? (
        <>
          <div className="flex flex-col gap-2">
            {query.data.items.map((c) => (
              <EntityItem
                key={c.id}
                title={c.name}
                subtitle={`${TYPE_LABEL[c.type] ?? c.type} · Updated ${formatDistanceToNow(c.updatedAt)} ago`}
                href={`/credentials/${c.id}`}
                onDelete={() => remove.mutate({ id: c.id })}
                deleteConfirmTitle="Delete credential?"
                deleteConfirmDescription="Workflow nodes referencing this credential will lose access until they're pointed at another one."
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
