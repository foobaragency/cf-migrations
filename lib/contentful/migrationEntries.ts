import { EntryProps } from "contentful-management/dist/typings/export-types"

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

export async function getMigrationEntries(options: ContentfulPartialOptions) {
  const entries: EntryProps[] = []

  const client = getClient(options)
  const limit = 100
  const query = {
    content_type: config.contentful.contentType.id,
    order: "sys.createdAt",
  }

  // request all items in a chunked way
  let total = -1
  for (let i = 0; total !== entries.length; i++) {
    const entriesResponse = await client.entry.getMany({
      ...options,
      query: {
        ...query,
        limit,
        skip: i * limit,
      },
    })

    entries.push(...entriesResponse.items)
    total = entriesResponse.total
  }

  return entries
}

export async function getContentTypes(options: ContentfulPartialOptions) {
  return getClient(options).contentType.getMany(options)
}
