import { runMigration } from "contentful-migration"

import { MigrationOptions, PendingMigration } from "../types"

export async function runMigrations(
  pendingMigrations: PendingMigration[],
  options: MigrationOptions
) {
  const yes = options.yes !== undefined ? options.yes : true
  for (const { filePath } of pendingMigrations) {
    await runMigration({ ...options, filePath, yes })
  }
}
