import {
  getDeployedMigrations,
  updateMigrationState,
} from "./contentful/management"
import { runMigrations } from "./migrationManagement/runMigrations"
import { MigrationOptions } from "./types"
import { processMigrationFileNames } from "./migrationManagement/migrationFiles"
import {
  generateMigrationStates,
  getPendingMigrations,
} from "./migrationManagement/migrationState"
import { getMigrationDetailsAndValidate } from "./migrationManagement/migrationValidations"
import { info } from "./logger"

export type DeployOptions = {
  options: MigrationOptions
  migrationNames?: string[]
  deployedMigrations?: string[]
}

export async function deployMigrations({
  options,
  migrationNames,
  deployedMigrations,
}: DeployOptions) {
  const migrationFileNames = await processMigrationFileNames(
    options.migrationsDirectory,
    migrationNames
  )

  getMigrationDetailsAndValidate(migrationFileNames)

  const deployedMigrationNames =
    deployedMigrations || (await getDeployedMigrations(options))
  const pendingMigrations = getPendingMigrations(
    options.migrationsDirectory,
    deployedMigrationNames,
    migrationFileNames
  )

  if (pendingMigrations.length === 0) {
    info(`Skipping migration deploy since there's no pending migrations`)

    return pendingMigrations
  }

  const runMigrationsResult = await runMigrations(pendingMigrations, options)
  const migrationStates = generateMigrationStates(
    pendingMigrations.map(({ fileName }) => fileName),
    runMigrationsResult,
    options.locale
  )

  await updateMigrationState(options, migrationStates)

  return pendingMigrations
}
