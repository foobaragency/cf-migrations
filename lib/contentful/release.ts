import type { EnvironmentProps } from "contentful-management"

import { info } from "../logger"
import { ContentfulPartialOptions } from "../types"

import { deleteEnvironment } from "./environments"

export function getReleaseEnvironmentsOldestFirst(
  releasePrefix: string,
  environments: EnvironmentProps[]
): EnvironmentProps[] {
  return environments
    .filter(env => env.name.startsWith(releasePrefix))
    .sort((a, b) => a.sys.createdAt.localeCompare(b.sys.createdAt))
}

/**
 * Contentful offers a limited number of environments we can create.
 * So, this is needed in order to keep this deployment workflow fully automated.
 */
export function getOldestUnaliasedReleaseEnvironment(
  releasePrefix: string,
  aliasedEnvironment: string,
  environments: EnvironmentProps[]
): string | undefined {
  const unaliasedReleaseEnvsOldestFirst = getReleaseEnvironmentsOldestFirst(
    releasePrefix,
    environments
  ).filter(env => !env.sys.aliases?.length && env.sys.id !== aliasedEnvironment)

  return unaliasedReleaseEnvsOldestFirst?.[0]?.sys?.id
}

/**
 * get currently active release that is aliased with aliasedEnvironment
 */
export function getActiveReleaseEnvId(
  releasePrefix: string,
  aliasedEnvironment: string,
  environments: EnvironmentProps[]
) {
  const activeRelease = getReleaseEnvironmentsOldestFirst(
    releasePrefix,
    environments
  )
    .filter(
      env => !!env.sys.aliasedEnvironment && env.sys.id === aliasedEnvironment
    )
    .pop()

  return activeRelease?.name
}

/**
 * Create a fresh copy of the target environment for the new release.
 */
export function getNextReleaseEnvId(
  releasePrefix: string,
  environments: EnvironmentProps[]
) {
  const highestReleaseNumber = getReleaseEnvironmentsOldestFirst(
    releasePrefix,
    environments
  )
    .map(env => Number(env.name.slice(releasePrefix.length)))
    .filter(number => Number.isFinite(number))
    .reduce((highest, number) => Math.max(highest, number), 0)

  return `${releasePrefix}${highestReleaseNumber + 1}`
}

export async function freeUpEnvironmentIfNeeded(
  releasePrefix: string,
  maxEnvironments: number,
  environments: EnvironmentProps[],
  options: ContentfulPartialOptions
) {
  const releaseEnvironments = getReleaseEnvironmentsOldestFirst(
    releasePrefix,
    environments
  )

  if (releaseEnvironments.length < maxEnvironments) {
    return true
  }
  const envIdToDelete = getOldestUnaliasedReleaseEnvironment(
    releasePrefix,
    options.environmentId,
    environments
  )

  if (!envIdToDelete) {
    return false
  }

  await deleteEnvironment({ ...options, environmentId: envIdToDelete })

  info(`Environment ${envIdToDelete} was removed`)
}
