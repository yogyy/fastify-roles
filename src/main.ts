import { env } from "./config/env";
import { db } from "./db";
import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";
import { migrate } from "drizzle-orm/postgres-js/migrator";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  await app.listen({ port: env.PORT, host: env.HOST });

  // await migrate(db, {
  //   migrationsFolder: "./migration",
  // }); // <== un-comment this when migration
  const signals = ["SIGINT", "SIGTERM"];

  // logger.debug(env, "using env");

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({
        app,
      });
    });
  }
}

main();
