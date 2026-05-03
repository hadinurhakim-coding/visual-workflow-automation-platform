import { CredentialDetail } from "@/features/credentials/components/credential-detail";

export default async function CredentialDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CredentialDetail id={id} />;
}
