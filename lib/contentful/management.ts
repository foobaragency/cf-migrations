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

  return getDeployedMigrationNames(migrationEntries, options.locale)
}

export function getDeployedMigrationNames(
  migrationEntries: CollectionProp<EntryProps>,
  contentfulLocale?: string
) {
  const locale = contentfulLocale || config.contentful.locale
  const deployedFiles = migrationEntries.items.map(
    item => (item.fields as MigrationEntry).fileName[locale]
  )

  return deployedFiles
}
