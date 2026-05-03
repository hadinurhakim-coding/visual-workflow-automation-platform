import { z } from "zod";
import cuid from "cuid";
import { TRPCError } from "@trpc/server";
import { CredentialType } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { PAGINATION } from "@/config/constants";

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

export const credentialsRouter = createTRPCRouter({
  // ── List (paginated, scoped to user, name search) ──
  getMany: protectedProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.auth.user.id,
        ...(input.search
          ? { name: { contains: input.search, mode: "insensitive" as const } }
          : {}),
      };

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
          // Don't expose the encrypted value in lists
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.credential.count({ where }),
      ]);

      return { items, totalCount };
    }),

  // ── Detail (returns metadata, NOT the value) ──
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findFirst({
        where: { id: input.id, userId: ctx.auth.user.id },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!credential) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Credential not found" });
      }
      return credential;
    }),

  // ── Filter by type (used by AI node settings dialog) ──
  getByType: protectedProcedure
    .input(z.object({ type: z.nativeEnum(CredentialType) }))
    .query(async ({ ctx, input }) => {
      return prisma.credential.findMany({
        where: { userId: ctx.auth.user.id, type: input.type },
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, type: true },
      });
    }),

  // ── Create ──
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.nativeEnum(CredentialType),
        value: z.string().min(1, "API key is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const credential = await prisma.credential.create({
        data: {
          id: cuid(),
          name: input.name,
          type: input.type,
          value: encrypt(input.value),
          userId: ctx.auth.user.id,
        },
        select: { id: true },
      });
      return credential;
    }),

  // ── Update — value is OPTIONAL.
  //    If empty, only metadata is updated (avoids the double-encrypt footgun
  //    where re-saving a fetched ciphertext would corrupt the credential). ──
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100),
        type: z.nativeEnum(CredentialType),
        value: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await prisma.credential.updateMany({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: {
          name: input.name,
          type: input.type,
          ...(input.value ? { value: encrypt(input.value) } : {}),
        },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Credential not found" });
      }
      return { success: true };
    }),

  // ── Delete ──
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await prisma.credential.deleteMany({
        where: { id: input.id, userId: ctx.auth.user.id },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Credential not found" });
      }
      return { success: true };
    }),
});
