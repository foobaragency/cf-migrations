import { runMigration } from "contentful-migration"

import { info, success, error } from "../logger"
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

    let result
    try {
      // disable this es-lint warning because the underlying function return "any" type and we have no control over that.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result = await runMigration({ ...options, filePath, yes })
    } catch (e) {
      info(`${filePath} migration failed`)
      error((e as Error).message)
    }

    if (result) {
      success(`${filePath} migration deployed`)
      migrationResult.push({ successful: true, fileName })
    } else {
      migrationResult.push({ successful: false, fileName })
    }
  }

  return migrationResult
}
