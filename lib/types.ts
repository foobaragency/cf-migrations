import Migration from "contentful-migration"

export { Migration }

export type ContentfulPartialOptions = {
  environmentId: string
  spaceId: string
  accessToken: string
  locale?: string
}

export type MigrationOptions = ContentfulPartialOptions & {
  migrationsDirectory: string
}
