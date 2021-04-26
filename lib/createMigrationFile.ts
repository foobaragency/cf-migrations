import { outputFile } from "fs-extra"

import {
  getMigrationFileData,
  getNextMigrationFileName,
  processMigrationFileNames,
} from "./migrationManagement/migrationFiles"

export async function createMigrationFile(
  migrationsDir: string,
  name: string,
  useJavascript = false
) {
  const migrationFileNames = await processMigrationFileNames(migrationsDir)
  const nextMigrationFileName = getNextMigrationFileName(
    name,
    migrationFileNames
  )
  const migrationData = getMigrationFileData(
    migrationsDir,
    nextMigrationFileName,
    useJavascript
  )

  await outputFile(migrationData.path, migrationData.content)

  return migrationData.path
}
