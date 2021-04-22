import {
  createEnvironment,
  getAllEnvironments,
  updateEnvironmentAlias,
} from "./contentful/environments"
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
  options: MigrationOptions
}

export async function createDeploymentRelease({
  releasePrefix,
  availableEnvironments,
  options,
}: ReleaseOptions) {
  const hasPendingMigrations = await assessPendingMigrations(options)
  if (!hasPendingMigrations) {
    return false
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
  await deployMigrations({ ...options, environmentId: releaseEnvironmentId })
  await updateEnvironmentAlias(
    options.environmentId,
    releaseEnvironmentId,
    options
  )

  return true
}
