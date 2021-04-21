import { outputFile } from "fs-extra"

import {
  getMigrationsDirectoryPath,
  getNextMigrationFileName,
  processMigrationFileNames,
} from "./migrationManagement/migrationFiles"
import { success } from "./cli/logger"

const tsMigrationTemplate = `import { MigrationFunction } from "contentful-migration"

export = function (migration) {
  // Write your migration here
} as MigrationFunction

`

export async function createMigrationFile(
  migrationsPath: string,
  name: string
) {
  const migrationFileNames = await processMigrationFileNames(migrationsPath)
  const nextMigrationFileName = getNextMigrationFileName(
    name,
    migrationFileNames
  )
  const migrationFilePath = `${getMigrationsDirectoryPath(
    migrationsPath
  )}/${nextMigrationFileName}.ts`

  await outputFile(tsMigrationTemplate, migrationFilePath)

  success(`New migration created at ${migrationFilePath}`)
}
