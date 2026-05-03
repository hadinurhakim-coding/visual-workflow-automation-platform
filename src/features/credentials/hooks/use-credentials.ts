"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CredentialType } from "@prisma/client";
import { trpc } from "@/trpc/client";
import { useCredentialsParams } from "./use-credentials-params";

// ── Queries ────────────────────────────────────────────

export function useCredentials() {
  const [params] = useCredentialsParams();
  return trpc.credentials.getMany.useQuery(params);
}

export function useCredential(id: string) {
  return trpc.credentials.getOne.useQuery({ id });
}

export function useCredentialsByType(type: CredentialType) {
  return trpc.credentials.getByType.useQuery({ type });
}

// ── Mutations ──────────────────────────────────────────

export function useCreateCredential() {
  const router = useRouter();
  const utils = trpc.useUtils();
  return trpc.credentials.create.useMutation({
    onSuccess: () => {
      toast.success("Credential created");
      utils.credentials.getMany.invalidate();
      utils.credentials.getByType.invalidate();
      router.push("/credentials");
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdateCredential() {
  const utils = trpc.useUtils();
  return trpc.credentials.update.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Credential updated");
      utils.credentials.getOne.invalidate({ id: variables.id });
      utils.credentials.getMany.invalidate();
      utils.credentials.getByType.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRemoveCredential() {
  const utils = trpc.useUtils();
  return trpc.credentials.remove.useMutation({
    onSuccess: () => {
      toast.success("Credential deleted");
      utils.credentials.getMany.invalidate();
      utils.credentials.getByType.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
}
