import prisma from '@/server/db';

export type Context = { prisma: typeof prisma };

export async function createContext(): Promise<Context> {
  return { prisma };
}
