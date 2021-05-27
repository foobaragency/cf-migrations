import {
  checkEnvironmentReadyStatus,
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
import { info, success, warn } from "./logger"
import { assessPendingMigrations } from "./migrationManagement/migrationState"
import { MigrationOptions } from "./types"

export type ReleaseOptions = {
  releasePrefix: string
  availableEnvironments: number
  ignoreMigrationCheck?: boolean
  environmentCreationSecondsTimeout?: number
  options: MigrationOptions
}

export async function createReleaseEnvironment({
  releasePrefix,
  availableEnvironments,
  ignoreMigrationCheck = false,
  environmentCreationSecondsTimeout = 1,
  options,
}: ReleaseOptions) {
  if (options.environmentId !== "master") {
    warn(
      `Releases are intented to work with 'master' aliases. It might no work when running it against another environment`
    )
  }

  const deployedMigrations = await getDeployedMigrations(options)
  if (!ignoreMigrationCheck) {
    const hasPendingMigrations = await assessPendingMigrations(
      options.migrationsDirectory,
      deployedMigrations
    )
    if (!hasPendingMigrations) {
      info(`Skipping release since no pending migration was found.`)

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
  await checkEnvironmentReadyStatus(
    {
      ...options,
      environmentId: releaseEnvironmentId,
    },
    environmentCreationSecondsTimeout
  )
  info(`Environment ${releaseEnvironmentId} was created.`)
  const deployOptions = { ...options, environmentId: releaseEnvironmentId }
  await deployMigrations({ options: deployOptions, deployedMigrations })
  await updateEnvironmentAlias(
    options.environmentId,
    releaseEnvironmentId,
    options
  )
  info(
    `Alias for the environment ${options.environmentId} was updated to ${releaseEnvironmentId}`
  )

  success(
    `Release '${releaseEnvironmentId}' based on the '${options.environmentId}' environment in the space id '${options.spaceId}' was created`
  )

  return releaseEnvironmentId
}
