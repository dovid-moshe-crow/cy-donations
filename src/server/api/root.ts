import { createTRPCRouter } from "./trpc";
import { donationsRouter } from "./routers/donations";
import { ambRouter } from "./routers/amb";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  donations: donationsRouter,
  amb: ambRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
