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
