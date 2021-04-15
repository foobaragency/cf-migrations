import difference from "lodash/difference"

import { config } from "../config"
import { LocaleDependent } from "../contentful/types"
import { MigrationOptions } from "../types"

import { getMigrationFilePaths } from "./migrationFiles"

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
