import { runMigration } from "contentful-migration"

import { ContentfulPartialOptions } from "../types"

export async function runMigrations(
  migrationFilePaths: string[],
  options: ContentfulPartialOptions
) {
  for (const filePath of migrationFilePaths) {
    await runMigration({ ...options, filePath, yes: true })
  }
}
