import { config } from "../config"
import { ContentfulPartialOptions } from "../types"

import { getClient } from "./client"
import { MigrationEntry } from "./types"

export async function createMigrationEntries(
  fields: MigrationEntry,
  options: ContentfulPartialOptions
) {
  return getClient(options).entry.create(
    { ...options, contentTypeId: config.contentful.contentType.id },
    { fields }
  )
}

// TODO this might need pagination due to a CF limitation
export async function getMigrationEntries(options: ContentfulPartialOptions) {
  return getClient(options).entry.getMany({
    ...options,
    query: {
      content_type: config.contentful.contentType.id,
    },
  })
}

export async function getContentTypes(options: ContentfulPartialOptions) {
  return getClient(options).contentType.getMany(options)
}
