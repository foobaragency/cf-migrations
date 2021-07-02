import { runMigration } from "contentful-migration"

import { info, success } from "../logger"
import { MigrationOptions, PendingMigration } from "../types"

export type MigrationResult = {
  successful: boolean
  fileName: string
}

export async function runMigrations(
  pendingMigrations: PendingMigration[],
  options: MigrationOptions
): Promise<MigrationResult[]> {
  const yes = options.yes !== undefined ? options.yes : true
  const migrationResult: MigrationResult[] = []
  for (const { filePath, fileName } of pendingMigrations) {
    info(`Deploying migration ${filePath}...`)

    // disable this es-lint warning because the underlying function return "any" type and we have no control over that.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await runMigration({ ...options, filePath, yes })
    if (result) {
      success(`${filePath} migration deployed`)
      migrationResult.push({ successful: true, fileName })
    }
    migrationResult.push({ successful: false, fileName })
  }

  return migrationResult
}
