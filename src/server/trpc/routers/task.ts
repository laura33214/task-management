import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type { Task } from '@prisma/client';
import { publicProcedure, router } from '../trpc';

const idSchema = z.object({ id: z.uuid() });

const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

const createTaskInput = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().max(10_000).optional().nullable(),
  priority: PriorityEnum.optional().default('MEDIUM'),
  // accept date string like "2025-10-02" or ISO, transform to Date
  dueDate: z
    .preprocess(
      v =>
        typeof v === 'string' && v ? new Date(v) : v === '' ? undefined : v,
      z.date().optional()
    )
    .optional(),
});

const updateTaskInput = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(10_000).optional().nullable(),
  completed: z.boolean().optional(),
  priority: PriorityEnum.optional(),
  dueDate: z
    .preprocess(
      v =>
        typeof v === 'string' && v ? new Date(v) : v === '' ? undefined : v,
      z.date().optional()
    )
    .optional(),
});

export const taskRouter = router({
  getTasks: publicProcedure.query(async ({ ctx }): Promise<Task[]> => {
    try {
      return await ctx.prisma.task.findMany({ orderBy: { createdAt: 'desc' } });
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch tasks',
      });
    }
  }),

  createTask: publicProcedure
    .input(createTaskInput)
    .mutation(async ({ ctx, input }): Promise<Task> => {
      try {
        return await ctx.prisma.task.create({
          data: {
            title: input.title,
            description: input.description ?? undefined,
            priority: input.priority ?? 'MEDIUM',
            dueDate: input.dueDate ?? undefined,
          },
        });
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to create task',
        });
      }
    }),

  updateTask: publicProcedure
    .input(updateTaskInput)
    .mutation(async ({ ctx, input }): Promise<Task> => {
      try {
        return await ctx.prisma.task.update({
          where: { id: input.id },
          data: {
            ...(input.title !== undefined ? { title: input.title } : {}),
            ...(input.description !== undefined
              ? { description: input.description }
              : {}),
            ...(input.completed !== undefined
              ? { completed: input.completed }
              : {}),
            ...(input.priority !== undefined
              ? { priority: input.priority }
              : {}),
            ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
          },
        });
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to update task',
        });
      }
    }),

  deleteTask: publicProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }): Promise<Task> => {
      try {
        return await ctx.prisma.task.delete({ where: { id: input.id } });
      } catch {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to delete task',
        });
      }
    }),
});

export type TaskRouter = typeof taskRouter;
