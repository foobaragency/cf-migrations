import {
  createEnvironment,
  getAllEnvironments,
  updateEnvironmentAlias,
} from "./contentful/environments"
import { getDeployedMigrations } from "./contentful/management"
import {
  freeUpEnvironmentIfNeeded,
  getNextReleaseEnvId,
} from "./contentful/release"
import { deployMigrations } from "./deploy"
import { assessPendingMigrations } from "./migrationManagement/migrationState"
import { MigrationOptions } from "./types"

export type ReleaseOptions = {
  releasePrefix: string
  availableEnvironments: number
  ignoreMigrationCheck?: boolean
  options: MigrationOptions
}

export async function createDeploymentRelease({
  releasePrefix,
  availableEnvironments,
  ignoreMigrationCheck = false,
  options,
}: ReleaseOptions) {
  const deployedMigrations = await getDeployedMigrations(options)
  if (!ignoreMigrationCheck) {
    const hasPendingMigrations = await assessPendingMigrations(
      options.migrationsDirectory,
      deployedMigrations
    )
    if (!hasPendingMigrations) {
      return
    }
  }

  const environments = await getAllEnvironments(options)
  await freeUpEnvironmentIfNeeded(
    releasePrefix,
    availableEnvironments,
    environments,
    options
  )
  const releaseEnvironmentId = getNextReleaseEnvId(releasePrefix, environments)
  await createEnvironment({ ...options, environmentId: releaseEnvironmentId })
  const deployOptions = { ...options, environmentId: releaseEnvironmentId }
  await deployMigrations({ options: deployOptions, deployedMigrations })
  await updateEnvironmentAlias(
    options.environmentId,
    releaseEnvironmentId,
    options
  )

  return releaseEnvironmentId
}
