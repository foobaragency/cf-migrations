import path from "path"

import difference from "lodash/difference"

import { config } from "../config"
import { LocaleDependent } from "../contentful/types"
import { PendingMigration } from "../types"

import { processMigrationFileNames } from "./migrationFiles"

export async function assessPendingMigrations(
  migrationsDirectory: string,
  deployedMigrations: string[]
) {
  const migrationFileNames =
    await processMigrationFileNames(migrationsDirectory)

  const pendingMigrations = getPendingMigrations(
    migrationsDirectory,
    deployedMigrations,
    migrationFileNames
  )

  return pendingMigrations.length > 0
}

export function toMigrationState(fileName: string, locale?: string) {
  const migrationLocale = locale || config.contentful.defaultLocale
  const state: LocaleDependent = {}
  state[migrationLocale] = fileName

  return { fileName: state }
}

export function getPendingMigrations(
  migrationsDirectory: string,
  deployedMigrations: string[],
  migrationFileNames: string[]
): PendingMigration[] {
  const pendingMigrations = difference(migrationFileNames, deployedMigrations)

  return pendingMigrations.map(fileName => ({
    fileName,
    filePath: path.resolve(`${migrationsDirectory}/${fileName}`),
  }))
}
