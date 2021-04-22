import { EnvironmentProps } from "contentful-management/dist/typings/export-types"

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
 * Create a fresh copy of the target environment for the new release.
 */
export function getNextReleaseEnvId(
  releasePrefix: string,
  environments: EnvironmentProps[]
) {
  const lastAlias = getReleaseEnvironmentsOldestFirst(
    releasePrefix,
    environments
  ).pop()

  if (!lastAlias) {
    return `${releasePrefix}1`
  }

  const i = +lastAlias.name.split("-")[1]
  const releaseEnvId = `${releasePrefix}${i + 1}`

  return releaseEnvId
}

export async function freeUpEnvironmentIfNeeded(
  releasePrefix: string,
  maxEnvironments: number,
  environments: EnvironmentProps[],
  options: ContentfulPartialOptions
) {
  if (environments.length < maxEnvironments) {
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
}
