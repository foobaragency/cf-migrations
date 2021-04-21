import path from "path"

import last from "lodash/last"
import { paramCase } from "change-case"
import globby from "globby"

import { validateMigrations } from "./migrationValidations"

export async function processMigrationFileNames(
  migrationsPath: string,
  migrationNames?: string[]
) {
  const migrationFileNames =
    migrationNames || (await getMigrationFileNames(migrationsPath))
  migrationFileNames.sort((a, b) => a.localeCompare(b))

  return migrationFileNames
}

async function getMigrationFileNames(migrationsDirectory: string) {
  const pattern = `${getMigrationsDirectoryPath(
    migrationsDirectory
  )}/**/*.{ts,js}`
  const files = await globby(pattern)

  return files.map(file => path.basename(file))
}

export function getMigrationFilePaths(
  migrationsDirectory: string,
  migrationNames: string[]
) {
  const directoryPath = getMigrationsDirectoryPath(migrationsDirectory)

  return migrationNames.map(name => `${directoryPath}/${name}`)
}

export function getMigrationsDirectoryPath(migrationsDirectory: string) {
  return path.join(process.cwd(), migrationsDirectory)
}

export function getNextMigrationFileName(
  name: string,
  migrationFileNames: string[]
) {
  const lastValidMigration = last(validateMigrations(migrationFileNames))
  const lastSequence = lastValidMigration?.sequence
  const sequence = lastSequence ? lastSequence + 1 : 1
  const sequenceString = String(sequence).padStart(4, "0")

  return `${sequenceString}-${paramCase(name)}`
}
