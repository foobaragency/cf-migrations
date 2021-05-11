import { CollectionProp } from "contentful-management/dist/typings/common-types"
import { EntryProps } from "contentful-management/dist/typings/export-types"

import { getDeployedMigrationNames } from "../../lib/contentful/management"

describe("Contentful Management", () => {
  const migrationEntries = {
    items: [
      {
        fields: { fileName: { "en-US": "0004-migration.ts" } },
      },
      {
        fields: { fileName: { "en-US": "0003-migration.ts" } },
      },
      {
        fields: { fileName: { "en-US": "0002-migration.ts" } },
      },
      {
        fields: { fileName: { "en-US": "0001-migration.ts" } },
      },
    ],
  } as unknown as CollectionProp<EntryProps>

  it("extracts deployed migration names from the Migration entries", () => {
    const deployedMigrations = getDeployedMigrationNames(migrationEntries)

    expect(deployedMigrations).toMatchSnapshot()
  })
})
