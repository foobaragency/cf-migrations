import {
  getDeployedMigrations,
  updateMigrationState,
} from "../contentful/management"
import { runMigrations } from "../contentful/migration"
import { MigrationOptions } from "../types"

import { processMigrationFileNames } from "./migrationFiles"
import {
  generateMigrationStates,
  getPendingMigrationFilePaths,
} from "./migrationState"
import { validateMigrations } from "./migrationValidations"

export async function deployMigrations(
  options: MigrationOptions,
  migrationNames?: string[]
) {
  const migrationFileNames = await processMigrationFileNames(
    options,
    migrationNames
  )

  validateMigrations(migrationFileNames)

  const deployedMigrations = await getDeployedMigrations(options)
  const {
    pendingMigrationFilePaths,
    pendingMigrations,
  } = getPendingMigrationFilePaths(
    options.migrationsDirectory,
    deployedMigrations,
    migrationFileNames
  )
  const migrationStates = generateMigrationStates(pendingMigrations)

  await runMigrations(pendingMigrationFilePaths, options)
  await updateMigrationState(options, migrationStates)

  return pendingMigrations
}
