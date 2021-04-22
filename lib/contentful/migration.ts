import { runMigration } from "contentful-migration"

import { MigrationOptions } from "../types"

export async function runMigrations(
  migrationFilePaths: string[],
  options: MigrationOptions
) {
  const yes = options.yes !== undefined ? options.yes : true
  for (const filePath of migrationFilePaths) {
    await runMigration({ ...options, filePath, yes })
  }
}
