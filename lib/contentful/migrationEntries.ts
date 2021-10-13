import { EntryProps } from "contentful-management/types"

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
  let totalEntries = 0

  do {
    const response = await client.entry.getMany({
      ...options,
      query: {
        content_type: config.contentful.contentType.id,
        order: "sys.createdAt",
        limit: 100,
        skip: entries.length,
      },
    })
    entries.push(...response.items)
    totalEntries = response.total
  } while (entries.length < totalEntries)

  return entries
}

export async function getContentTypes(options: ContentfulPartialOptions) {
  return getClient(options).contentType.getMany(options)
}
