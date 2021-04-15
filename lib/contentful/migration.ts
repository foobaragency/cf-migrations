import path from "path"

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

export async function initEnvironment(options: CTMigrationPartialOptions) {
  const filePath = path.normalize(
    `${process.cwd()}/node_modules/cf-migrations/dist/migrations/0001-create-migration-type.js`
  )
  await runMigration({
    ...options,
    filePath,
    yes: true,
  })
}
