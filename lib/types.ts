import Migration from "contentful-migration"

export { Migration }

export type CTMigrationPartialOptions = {
  environmentId: string
  spaceId: string
  accessToken: string
  locale?: string
}

export type MigrationOptions = CTMigrationPartialOptions & {
  migrationsDirectory: string
}
