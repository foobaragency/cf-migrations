import { runMigration } from "contentful-migration"

import { info, success } from "../logger"
import { MigrationOptions, PendingMigration } from "../types"

export async function runMigrations(
  pendingMigrations: PendingMigration[],
  options: MigrationOptions
) {
  const yes = options.yes !== undefined ? options.yes : true
  for (const { filePath } of pendingMigrations) {
    info(`Deploying migration ${filePath}...`)
    await runMigration({ ...options, filePath, yes })
    success(`${filePath} migration deployed`)
  }
}
