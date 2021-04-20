import { runMigration } from "contentful-migration"

import { MigrationOptions } from "../types"

export async function runMigrations(
  migrationFilePaths: string[],
  options: MigrationOptions
) {
  const yes = options.yes
  for (const filePath of migrationFilePaths) {
    await runMigration({ ...options, filePath, yes })
  }
}
