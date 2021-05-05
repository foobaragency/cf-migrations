import difference from "lodash/difference"

import { config } from "../config"
import { LocaleDependent } from "../contentful/types"
import { PendingMigration } from "../types"

import {
  getMigrationFilePaths,
  processMigrationFileNames,
} from "./migrationFiles"

export async function assessPendingMigrations(
  migrationsDirectory: string,
  deployedMigrations: string[]
) {
  const migrationFileNames = await processMigrationFileNames(
    migrationsDirectory
  )

  const pendingMigrations = getPendingMigrations(
    migrationsDirectory,
    deployedMigrations,
    migrationFileNames
  )

  return pendingMigrations.length > 0
}

export function generateMigrationStates(
  pendingMigrations: string[],
  locale?: string
) {
  const migrationLocale = locale || config.contentful.defaultLocale

  return pendingMigrations.map(migrationFile => {
    const fileName: LocaleDependent = {}
    fileName[migrationLocale] = migrationFile

    return { fileName }
  })
}

export function getPendingMigrations(
  migrationsDirectory: string,
  deployedMigrations: string[],
  migrationFileNames: string[]
): PendingMigration[] {
  const pendingMigrations = difference(migrationFileNames, deployedMigrations)

  return pendingMigrations.map(fileName => ({
    fileName,
    filePath: getMigrationFilePaths(migrationsDirectory, fileName),
  }))
}
