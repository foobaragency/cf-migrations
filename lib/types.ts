export type ContentfulPartialOptions = {
  environmentId: string
  spaceId: string
  accessToken: string
  locale?: string
  host?: string
  sourceEnvironmentId?: string
}

export type MigrationOptions = ContentfulPartialOptions & {
  yes?: boolean
  migrationsDirectory: string
  dryRun?: boolean
}

export type PendingMigration = {
  fileName: string
  filePath: string
}
