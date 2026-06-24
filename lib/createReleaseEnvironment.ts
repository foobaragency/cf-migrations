import {
  checkEnvironmentReadyStatus,
  createEnvironment,
  getAllEnvironments,
  updateEnvironmentAlias,
} from "./contentful/environments"
import { getDeployedMigrations } from "./contentful/management"
import {
  freeUpEnvironmentIfNeeded,
  getActiveReleaseEnvId,
  getNextReleaseEnvId,
} from "./contentful/release"
import { deployMigrations } from "./deploy"
import { error, info, success } from "./logger"
import { assessPendingMigrations } from "./migrationManagement/migrationState"
import type { MigrationOptions } from "./types"
import { copyScheduledActionsBetweenReleases } from "./contentful/scheduledActions"

export type ReleaseOptions = {
  releasePrefix: string
  availableEnvironments: number
  ignoreMigrationCheck?: boolean
  environmentCreationSecondsTimeout?: number
  copyScheduledActions?: boolean
  rateLimit?: number
  options: MigrationOptions
}

export async function createReleaseEnvironment({
  releasePrefix,
  availableEnvironments,
  ignoreMigrationCheck = false,
  environmentCreationSecondsTimeout = 1,
  copyScheduledActions,
  rateLimit = 7,
  options,
}: ReleaseOptions) {
  const deployedMigrations = await getDeployedMigrations(options)
  const shouldSkip = await shouldSkipRelease(
    ignoreMigrationCheck,
    options,
    deployedMigrations
  )

  if (shouldSkip) {
    return
  }

  const { activeEnvironmentId, releaseEnvironmentId } =
    await prepareReleaseEnvironment(
      releasePrefix,
      availableEnvironments,
      environmentCreationSecondsTimeout,
      options
    )

  const deployOptions = { ...options, environmentId: releaseEnvironmentId }
  const hasFailedMigrations = await deployReleaseEnvironmentMigrations(
    deployOptions,
    deployedMigrations
  )

  if (hasFailedMigrations) {
    return
  }

  await copyScheduledActionsIfNeeded(
    copyScheduledActions,
    activeEnvironmentId,
    releaseEnvironmentId,
    rateLimit,
    options
  )

  await updateEnvironmentAlias(
    options.environmentId,
    releaseEnvironmentId,
    options
  )
  info(
    `Alias for the environment ${options.environmentId} was updated to ${releaseEnvironmentId}`
  )

  success(
    `Release '${releaseEnvironmentId}' based on the '${options.environmentId}' was created`
  )

  return releaseEnvironmentId
}

async function shouldSkipRelease(
  ignoreMigrationCheck: boolean,
  options: MigrationOptions,
  deployedMigrations: string[]
) {
  if (ignoreMigrationCheck) {
    return false
  }

  const hasPendingMigrations = await assessPendingMigrations(
    options.migrationsDirectory,
    deployedMigrations
  )

  if (hasPendingMigrations) {
    return false
  }

  info(`Skipping release since no pending migration was found.`)

  return true
}

async function prepareReleaseEnvironment(
  releasePrefix: string,
  availableEnvironments: number,
  environmentCreationSecondsTimeout: number,
  options: MigrationOptions
) {
  const environments = await getAllEnvironments(options)
  await freeUpEnvironmentIfNeeded(
    releasePrefix,
    availableEnvironments,
    environments,
    options
  )
  const activeEnvironmentId = getActiveReleaseEnvId(
    releasePrefix,
    options.environmentId,
    environments
  )
  const releaseEnvironmentId = getNextReleaseEnvId(releasePrefix, environments)

  await createEnvironment({
    ...options,
    environmentId: releaseEnvironmentId,
    sourceEnvironmentId: options.environmentId,
  })
  await checkEnvironmentReadyStatus(
    {
      ...options,
      environmentId: releaseEnvironmentId,
    },
    environmentCreationSecondsTimeout
  )
  info(`Environment ${releaseEnvironmentId} was created.`)

  return {
    activeEnvironmentId,
    releaseEnvironmentId,
  }
}

async function deployReleaseEnvironmentMigrations(
  options: MigrationOptions,
  deployedMigrations: string[]
) {
  const deployMigrationResult = await deployMigrations({
    options,
    deployedMigrations,
  })

  const hasFailedMigrations = deployMigrationResult?.some(
    ({ successful }) => !successful
  )

  if (hasFailedMigrations) {
    error(`Skipping release since some migrations failed.`)
  }

  return hasFailedMigrations
}

async function copyScheduledActionsIfNeeded(
  copyScheduledActions: boolean | undefined,
  activeEnvironmentId: string | undefined,
  releaseEnvironmentId: string,
  rateLimit: number,
  options: MigrationOptions
) {
  if (copyScheduledActions && activeEnvironmentId !== undefined) {
    info(`Copying scheduledActions from previous active release`)
    await copyScheduledActionsBetweenReleases(
      options,
      activeEnvironmentId,
      releaseEnvironmentId,
      rateLimit
    )
  }
}
