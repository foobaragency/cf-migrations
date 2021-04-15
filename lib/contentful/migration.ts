import { runMigration } from "contentful-migration"

import { CTMigrationPartialOptions } from "../types"

export async function runMigrations(
  migrationFilePaths: string[],
  options: CTMigrationPartialOptions
) {
  for (const filePath of migrationFilePaths) {
    await runMigration({ ...options, filePath, yes: true })
  }
}
