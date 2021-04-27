import {
  getDeployedMigrations,
  updateMigrationState,
} from "./contentful/management"
import { runMigrations } from "./contentful/migration"
import { MigrationOptions } from "./types"
import { processMigrationFileNames } from "./migrationManagement/migrationFiles"
import {
  generateMigrationStates,
  getPendingMigrationFilePaths,
} from "./migrationManagement/migrationState"
import { getMigrationDetailsAndValidate } from "./migrationManagement/migrationValidations"

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
  const {
    pendingMigrationFilePaths,
    pendingMigrations,
  } = getPendingMigrationFilePaths(
    options.migrationsDirectory,
    deployedMigrationNames,
    migrationFileNames
  )
  const migrationStates = generateMigrationStates(pendingMigrations)

  await runMigrations(pendingMigrationFilePaths, options)
  await updateMigrationState(options, migrationStates)

  return pendingMigrations
}
