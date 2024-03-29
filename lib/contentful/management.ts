import { EntryProps } from "contentful-management/types"

import { config } from "../config"
import { ContentfulPartialOptions } from "../types"

import {
  createMigrationEntry,
  getContentTypes,
  getMigrationEntries,
} from "./migrationEntries"
import { MigrationEntry } from "./types"

export async function updateMigrationState(
  options: ContentfulPartialOptions,
  migrationStates: MigrationEntry[]
) {
  for (const stateFields of migrationStates) {
    await createMigrationEntry(stateFields, options)
  }
}

export async function getDeployedMigrations(options: ContentfulPartialOptions) {
  const migrationEntries = await getMigrationEntries(options)

  return getDeployedMigrationNames(migrationEntries, options.locale)
}

export function getDeployedMigrationNames(
  migrationEntries: EntryProps[],
  contentfulLocale?: string
) {
  const locale = contentfulLocale || config.contentful.defaultLocale
  const deployedFiles = migrationEntries.map(
    item => (item.fields as MigrationEntry).fileName[locale]
  )

  return deployedFiles
}

export async function assessMigrationsTypeExistence(
  options: ContentfulPartialOptions
) {
  const contentTypes = await getContentTypes(options)

  return contentTypes.items.some(
    contentType => contentType.name === config.contentful.contentType.name
  )
}
