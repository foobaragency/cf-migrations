import difference from "lodash/difference"

import { config } from "../config"
import { LocaleDependent } from "../contentful/types"
import { MigrationOptions } from "../types"

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

  const { pendingMigrations } = getPendingMigrationFilePaths(
    migrationsDirectory,
    deployedMigrations,
    migrationFileNames
  )

  return pendingMigrations.length > 0
}

export function generateMigrationStates(
  pendingMigrations: string[],
  options?: MigrationOptions
) {
  const locale = options?.locale || config.contentful.defaultLocale

  return pendingMigrations.map(migrationFile => {
    const fileName: LocaleDependent = {}
    fileName[locale] = migrationFile

    return { fileName }
  })
}

export function getPendingMigrationFilePaths(
  migrationsDirectory: string,
  deployedMigrations: string[],
  migrationFileNames: string[]
) {
  const pendingMigrations = difference(migrationFileNames, deployedMigrations)
  const pendingMigrationFilePaths = getMigrationFilePaths(
    migrationsDirectory,
    pendingMigrations
  )

  return { pendingMigrations, pendingMigrationFilePaths }
}
