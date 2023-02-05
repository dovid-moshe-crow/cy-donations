import { createTRPCRouter } from "./trpc";
import { donationsRouter } from "./routers/donations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  donations: donationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
