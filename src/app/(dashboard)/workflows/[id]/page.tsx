import { WorkflowDetail } from "@/features/workflows/components/workflow-detail";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowDetail id={id} />;
}
