import { z } from "zod";
import { TRPCError } from "@trpc/server";
import cuid from "cuid";
import { NodeType, Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { PAGINATION } from "@/config/constants";
import { generateWorkflowName } from "@/lib/name-generator";
import { sendWorkflowExecution } from "@/inngest/utils";

const paginationInput = z.object({
  page: z.number().int().min(PAGINATION.MIN_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
  search: z.string().default(""),
});

export const workflowsRouter = createTRPCRouter({
  // ── List (paginated, scoped to user, name search) ──
  getMany: protectedProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const where = {
        userId,
        ...(input.search
          ? { name: { contains: input.search, mode: "insensitive" as const } }
          : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
        }),
        prisma.workflow.count({ where }),
      ]);

      return { items, totalCount };
    }),

  // ── Detail (with nodes + connections in ReactFlow shape) ──
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.auth.user.id },
        include: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      // Transform to ReactFlow shape: { nodes: Node[], edges: Edge[] }
      const nodes = workflow.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: n.positionX, y: n.positionY },
        data: n.data as Record<string, unknown>,
      }));
      const edges = workflow.connections.map((c) => ({
        id: c.id,
        source: c.fromNodeId,
        target: c.toNodeId,
        // "default" is the schema default; surface as null so ReactFlow's edge
        // dedupe matches new edges drawn from unnamed handles.
        sourceHandle: c.fromOutput === "default" ? null : c.fromOutput,
        targetHandle: c.toInput === "default" ? null : c.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt,
        nodes,
        edges,
      };
    }),

  // ── Create (random name + single INITIAL node at origin) ──
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const workflowId = cuid();
    const initialNodeId = cuid();

    const workflow = await prisma.workflow.create({
      data: {
        id: workflowId,
        name: generateWorkflowName(),
        userId: ctx.auth.user.id,
        nodes: {
          create: {
            id: initialNodeId,
            type: NodeType.INITIAL,
            positionX: 0,
            positionY: 0,
            data: {},
          },
        },
      },
    });

    return workflow;
  }),

  // ── Rename (just the name) ──
  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1).max(100) }))
    .mutation(async ({ ctx, input }) => {
      // Ownership check via userId on update where clause
      const result = await prisma.workflow.updateMany({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }
      return { success: true };
    }),

  // ── Wipe-and-replace nodes & edges (canvas save) ──
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.nativeEnum(NodeType),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.unknown()).default({}),
          })
        ),
        edges: z.array(
          z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullable().optional(),
            targetHandle: z.string().nullable().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership first
      const owned = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.auth.user.id },
        select: { id: true },
      });
      if (!owned) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      // Transactional wipe-and-replace
      // Note: MongoDB Prisma supports interactive transactions on replica sets only.
      // Atlas free tier IS a replica set, so this works.
      await prisma.$transaction(async (tx) => {
        // Connections first (FK to nodes), then nodes
        await tx.connection.deleteMany({ where: { workflowId: input.id } });
        await tx.node.deleteMany({ where: { workflowId: input.id } });

        if (input.nodes.length > 0) {
          await tx.node.createMany({
            data: input.nodes.map((n) => ({
              id: n.id,
              workflowId: input.id,
              type: n.type,
              positionX: n.position.x,
              positionY: n.position.y,
              data: n.data as Prisma.InputJsonValue,
            })),
          });
        }

        if (input.edges.length > 0) {
          await tx.connection.createMany({
            data: input.edges.map((e) => ({
              id: e.id,
              workflowId: input.id,
              fromNodeId: e.source,
              toNodeId: e.target,
              fromOutput: e.sourceHandle ?? "default",
              toInput: e.targetHandle ?? "default",
            })),
          });
        }

        await tx.workflow.update({
          where: { id: input.id },
          data: { updatedAt: new Date() },
        });
      });

      return { success: true };
    }),

  // ── Delete ──
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await prisma.workflow.deleteMany({
        where: { id: input.id, userId: ctx.auth.user.id },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }
      return { success: true };
    }),

  // ── Execute (fires Inngest event; actual run happens async) ──
  execute: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findFirst({
        where: { id: input.id, userId: ctx.auth.user.id },
        select: { id: true },
      });
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      const { inngestEventId } = await sendWorkflowExecution({
        workflowId: workflow.id,
      });

      return { inngestEventId };
    }),
});
