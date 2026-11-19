import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL || "file:./dev.db";

  // Check Prisma version & adapter availability:
  // In Prisma 6, driver adapters are an opt-in preview feature ("driverAdapters").
  // If @prisma/adapter-better-sqlite3 is installed, instantiate with PrismaBetterSqlite3;
  // otherwise, fall back safely to Prisma 6's built-in SQLite engine.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const adapter = new PrismaBetterSqlite3({ url });
    return new PrismaClient({ adapter });
  } catch {
    return new PrismaClient();
  }
}

// Reuse one instance across hot reloads in development
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
