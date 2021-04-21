import { outputFile } from "fs-extra"

import {
  getMigrationFileData,
  getNextMigrationFileName,
  processMigrationFileNames,
} from "./migrationManagement/migrationFiles"
import { success } from "./cli/logger"

export async function createMigrationFile(
  migrationsPath: string,
  name: string,
  useJavascript = false
) {
  const migrationFileNames = await processMigrationFileNames(migrationsPath)
  const nextMigrationFileName = getNextMigrationFileName(
    name,
    migrationFileNames
  )
  const migrationData = getMigrationFileData(
    migrationsPath,
    nextMigrationFileName,
    useJavascript
  )

  await outputFile(migrationData.path, migrationData.content)

  success(`New migration created at ${migrationData.path}`)
}
