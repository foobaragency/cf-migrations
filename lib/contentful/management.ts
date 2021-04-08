import {
  CollectionProp,
  EntryProps,
} from "contentful-management/dist/typings/export-types"

import { config } from "../config"
import { CTMigrationPartialOptions } from "../types"

import { createMigrationEntries, getMigrationEntries } from "./migrationEntries"
import { MigrationEntry } from "./types"

export async function updateMigrationState(
  options: CTMigrationPartialOptions,
  migrationStates: MigrationEntry[]
) {
  for (const stateFields of migrationStates) {
    await createMigrationEntries(stateFields, options)
  }
}

export async function getDeployedMigrations(
  options: CTMigrationPartialOptions
) {
  const migrationEntries = await getMigrationEntries(options)

  return processMigrationEntries(options, migrationEntries)
}

export async function processMigrationEntries(
  options: CTMigrationPartialOptions,
  migrationEntries: CollectionProp<EntryProps>
) {
  const locale = options.locale || config.contentful.locale
  const deployedFiles = migrationEntries.items
    .map(item => item.fields as MigrationEntry)
    .map(field => field.fileName[locale])

  return deployedFiles
}
