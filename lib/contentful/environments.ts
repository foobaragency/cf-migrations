import { info } from "../logger"
import { ContentfulPartialOptions } from "../types"

import { getClient } from "./client"

export async function getAllEnvironments(options: ContentfulPartialOptions) {
  const result = await getClient(options).environment.getMany(options)

  return result.items
}

export async function createEnvironment(options: ContentfulPartialOptions) {
  return getClient(options).environment.createWithId(options, {
    name: options.environmentId,
  })
}

export async function deleteEnvironment(options: ContentfulPartialOptions) {
  return getClient(options).environment.delete(options)
}

export async function getAllEnvironmentAliases(
  options: ContentfulPartialOptions
) {
  return getClient(options).environmentAlias.getMany(options)
}

export async function findEnvironment(options: ContentfulPartialOptions) {
  return getClient(options).environment.get(options)
}

export async function updateEnvironmentAlias(
  aliasEnvironmentId: string,
  targetEnvironmentId: string,
  options: ContentfulPartialOptions
) {
  const releases = await getAllEnvironmentAliases(options)
  const currentAliasVersion =
    releases.items[releases.items.length - 1].sys.version
  const { spaceId } = options

  return getClient(options).environmentAlias.update(
    {
      spaceId,
      environmentAliasId: aliasEnvironmentId,
    },
    // This property sys makes no sense in the update payload 🤔
    // But is required by the typing since some properties (e.g. `version`) are used.
    //
    // According to the API documentation, it was intended to be present only in the response.
    // ref: https://www.contentful.com/developers/docs/references/content-management-api/#/reference/environment-aliases/environment-alias/create-update-an-environment-alias/console
    //
    // So, don't mind the createdAt and updatedAt having empty strings.
    {
      environment: {
        sys: {
          type: "Link",
          linkType: "Environment",
          id: targetEnvironmentId,
        },
      },
      sys: {
        type: "Environment Alias",
        id: aliasEnvironmentId,
        version: currentAliasVersion,
        createdAt: "",
        updatedAt: "",
        space: {
          sys: {
            type: "Link",
            linkType: "Space",
            id: spaceId,
          },
        },
      },
    }
  )
}

export async function checkEnvironmentReadyStatus(
  options: ContentfulPartialOptions,
  environmentCreationSecondsTimeout: number
): Promise<boolean> {
  const environment = await findEnvironment(options)
  const isEnvironmentReady = environment.sys.status.sys.id === "ready"

  if (isEnvironmentReady) {
    return true
  }

  if (environmentCreationSecondsTimeout === 0) {
    throw new Error(
      `Unable to make sure that environment "${options.environmentId}" status is ready`
    )
  }

  info(
    `Environment ${options.environmentId} isn't read yet. Remaining seconds ${environmentCreationSecondsTimeout}...`
  )
  await delay(1000)
  const remainingSeconds = environmentCreationSecondsTimeout - 1

  return checkEnvironmentReadyStatus(options, remainingSeconds)
}

function delay(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
