import { EntryProps } from "contentful-management/types"

import { getDeployedMigrationNames } from "../../lib/contentful/management"

describe("Contentful Management", () => {
  const sys = {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "rklm4ep5nhjl",
      },
    },
    id: "ZR86DUHQcB7GQNGB9AIjt",
    type: "Asset",
    createdAt: "2020-10-26T11:17:35.480Z",
    updatedAt: "2020-10-26T11:17:35.480Z",
    environment: {
      sys: {
        id: "dev",
        type: "Link",
        linkType: "Environment",
      },
    },
    version: 1,
    contentType: { sys: { type: "", linkType: "", id: "" } },
  }

  const migrationEntries: EntryProps[] = [
    {
      fields: { fileName: { "en-US": "0004-migration.ts" } },
      sys,
    },
    {
      fields: { fileName: { "en-US": "0003-migration.ts" } },
      sys,
    },
    {
      fields: { fileName: { "en-US": "0002-migration.ts" } },
      sys,
    },
    {
      fields: { fileName: { "en-US": "0001-migration.ts" } },
      sys,
    },
  ]

  it("extracts deployed migration names from the Migration entries", () => {
    const deployedMigrations = getDeployedMigrationNames(migrationEntries)

    expect(deployedMigrations).toMatchSnapshot()
  })
})
