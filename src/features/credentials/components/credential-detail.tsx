"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { CredentialForm } from "./credential-form";
import { useCredential, useUpdateCredential } from "../hooks/use-credentials";

export function CredentialDetail({ id }: { id: string }) {
  const query = useCredential(id);
  const update = useUpdateCredential();

  if (query.isLoading) return <LoadingView label="Loading credential..." />;
  if (query.isError) return <ErrorView message={query.error.message} />;
  if (!query.data) return null;

  const credential = query.data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/credentials">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Credentials
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{credential.name}</h1>
      </div>

      <CredentialForm
        mode="update"
        defaultValues={{
          name: credential.name,
          type: credential.type,
          value: "",
        }}
        onSubmit={async (values) => {
          await update.mutateAsync({
            id,
            name: values.name,
            type: values.type,
            value: values.value,
          });
        }}
      />
    </div>
  );
}
