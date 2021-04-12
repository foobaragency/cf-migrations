import difference from "lodash/difference"

import { config } from "../config"
import { LocaleDependent } from "../contentful/types"
import { MigrationOptions } from "../types"

import { getMigrationFilePaths } from "./migrationFiles"

export function generateMigrationStates(
  pendingMigrations: string[],
  options?: MigrationOptions
) {
  const locale = options?.locale || config.contentful.locale

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
  const pendingMigrations = filterPendingMigrations(
    migrationFileNames,
    deployedMigrations
  )
  const pendingMigrationFilePaths = getMigrationFilePaths(
    migrationsDirectory,
    pendingMigrations
  )

  return { pendingMigrations, pendingMigrationFilePaths }
}

function filterPendingMigrations(
  migrationFiles: string[],
  deployedMigrations: string[]
) {
  return difference(migrationFiles, deployedMigrations)
}
