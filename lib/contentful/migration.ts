import { PassThrough } from "stream"

import { runMigration } from "contentful-migration"

import { info, success, error } from "../logger"
import { MigrationOptions, PendingMigration } from "../types"
import { toMigrationState } from "../migrationManagement/migrationState"

import { createMigrationEntry } from "./migrationEntries"

export type MigrationResult = {
  successful: boolean
  fileName: string
}

async function planMigration(options: MigrationOptions, filePath: string) {
  const originalStdin = process.stdin
  const fakeStdin = new PassThrough()
  // A confirm prompt reads a single line; "n" declines the apply step.
  fakeStdin.end("n\n")

  Object.defineProperty(process, "stdin", {
    value: fakeStdin,
    configurable: true,
  })

  try {
    await runMigration({ ...options, filePath, yes: false })
  } finally {
    Object.defineProperty(process, "stdin", {
      value: originalStdin,
      configurable: true,
    })
  }
}

export async function runMigrations(
  pendingMigrations: PendingMigration[],
  options: MigrationOptions
): Promise<MigrationResult[]> {
  const yes = options.yes !== undefined ? options.yes : true
  const migrationResult: MigrationResult[] = []
  for (const { filePath, fileName } of pendingMigrations) {
    if (options.dryRun) {
      info(`Planning migration ${filePath} (dry run)...`)

      try {
        await planMigration(options, filePath)
        migrationResult.push({ successful: true, fileName })
      } catch (e) {
        info(`${filePath} migration plan failed`)
        error((e as Error).message)
        migrationResult.push({ successful: false, fileName })
      }

      continue
    }

    info(`Deploying migration ${filePath}...`)

    let result
    try {
      // disable this es-lint warning because the underlying function return "any" type and we have no control over that.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      result = await runMigration({ ...options, filePath, yes })

      const migrationState = toMigrationState(fileName, options.locale)
      await createMigrationEntry(migrationState, options)
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
