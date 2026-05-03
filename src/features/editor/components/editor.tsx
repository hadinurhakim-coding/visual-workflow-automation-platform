"use client";

import { useCallback, useMemo, useState } from "react";
import cuid from "cuid";
import { useSetAtom } from "jotai";
import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { NodeType } from "@prisma/client";
import { editorAtom } from "@/features/editor/store/atoms";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

type EditorProps = {
  workflowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
};

function EditorInner({ workflowId, initialNodes, initialEdges }: EditorProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const setEditor = useSetAtom(editorAtom);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((es) => addEdge({ ...params, id: cuid() }, es)),
    [],
  );

  const onInit = useCallback(
    (instance: ReactFlowInstance) => setEditor(instance),
    [setEditor],
  );

  const nodeTypes = useMemo(() => nodeComponents, []);

  const hasManualTrigger = nodes.some((n) => n.type === NodeType.MANUAL_TRIGGER);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.4 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={16} />
      <Controls />
      <MiniMap pannable zoomable />
      <Panel position="top-right">
        <AddNodeButton />
      </Panel>
      {hasManualTrigger ? (
        <Panel position="bottom-center">
          <ExecuteWorkflowButton workflowId={workflowId} />
        </Panel>
      ) : null}
    </ReactFlow>
  );
}

export function Editor(props: EditorProps) {
  return (
    <ReactFlowProvider>
      <EditorInner {...props} />
    </ReactFlowProvider>
  );
}
