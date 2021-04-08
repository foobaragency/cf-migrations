import { createClient, PlainClientAPI } from "contentful-management"

import { CTMigrationPartialOptions } from "../types"

import { MigrationEntry } from "./types"

let client: PlainClientAPI | undefined

export async function createMigrationEntries(
  fields: MigrationEntry,
  options: CTMigrationPartialOptions
) {
  return getClient(options).entry.create(
    { ...options, contentTypeId: "migration" },
    { fields }
  )
}

// TODO this might need pagination due to a CF limitation
export async function getMigrationEntries(options: CTMigrationPartialOptions) {
  return getClient(options).entry.getMany({
    ...options,
    query: {
      content_type: "migration",
    },
  })
}

function getClient(options: CTMigrationPartialOptions) {
  if (!client) {
    client = createClient(options, { type: "plain" })
  }

  return client
}
