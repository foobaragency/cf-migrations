import path from "path"

import { runMigration } from "contentful-migration"

import { ContentfulPartialOptions } from "../types"

export async function initEnvironment(options: ContentfulPartialOptions) {
  const filePath = path.normalize(
    `${process.cwd()}/node_modules/cf-migrations/dist/migrations/0001-create-migration-type.js`
  )
  await runMigration({
    ...options,
    filePath,
    yes: true,
  })
}
