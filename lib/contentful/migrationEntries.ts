import { createClient, PlainClientAPI } from "contentful-management"

import { config } from "../config"
import { ContentfulPartialOptions } from "../types"

import { MigrationEntry } from "./types"

let client: PlainClientAPI | undefined

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

function getClient(options: ContentfulPartialOptions) {
  if (!client) {
    client = createClient(options, { type: "plain" })
  }

  return client
}
