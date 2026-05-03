import { ExecutionDetail } from "@/features/executions/components/execution-detail";

export default async function ExecutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExecutionDetail id={id} />;
}
