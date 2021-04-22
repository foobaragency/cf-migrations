import difference from "lodash/difference"

import { config } from "../config"
import { getDeployedMigrations } from "../contentful/management"
import { LocaleDependent } from "../contentful/types"
import { MigrationOptions } from "../types"

import {
  getMigrationFilePaths,
  processMigrationFileNames,
} from "./migrationFiles"

export async function assessPendingMigrations(options: MigrationOptions) {
  const migrationFileNames = await processMigrationFileNames(
    options.migrationsDirectory
  )

  const deployedMigrations = await getDeployedMigrations(options)

  const { pendingMigrations } = getPendingMigrationFilePaths(
    options.migrationsDirectory,
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
