import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { PAGINATION } from "@/config/constants";

const paginationInput = z.object({
  page: z.number().int().min(PAGINATION.MIN_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(PAGINATION.MIN_PAGE_SIZE)
    .max(PAGINATION.MAX_PAGE_SIZE)
    .default(PAGINATION.DEFAULT_PAGE_SIZE),
});

export const executionsRouter = createTRPCRouter({
  // ── List (scoped to user via workflow.userId) ──
  getMany: protectedProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const where = {
        workflow: { userId: ctx.auth.user.id },
      };

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          where,
          orderBy: { startedAt: "desc" },
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          include: { workflow: { select: { id: true, name: true } } },
        }),
        prisma.execution.count({ where }),
      ]);

      return { items, totalCount };
    }),

  // ── Detail ──
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const execution = await prisma.execution.findFirst({
        where: {
          id: input.id,
          workflow: { userId: ctx.auth.user.id },
        },
        include: { workflow: { select: { id: true, name: true } } },
      });
      if (!execution) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Execution not found" });
      }
      return execution;
    }),
});
