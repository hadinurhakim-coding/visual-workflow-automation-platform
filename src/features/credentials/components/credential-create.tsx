"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CredentialForm } from "./credential-form";
import { useCreateCredential } from "../hooks/use-credentials";

export function CredentialCreate() {
  const create = useCreateCredential();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/credentials">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Credentials
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">New credential</h1>
      </div>

      <CredentialForm
        mode="create"
        onSubmit={async (values) => {
          await create.mutateAsync(values);
        }}
      />
    </div>
  );
}
