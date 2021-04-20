export type ContentfulPartialOptions = {
  environmentId: string
  spaceId: string
  accessToken: string
  locale?: string
}

export type MigrationOptions = ContentfulPartialOptions & {
  yes?: boolean
  migrationsDirectory: string
}
