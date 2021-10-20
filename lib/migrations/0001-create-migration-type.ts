import Migration, { MigrationFunction } from "contentful-migration"

import { config } from "../config"

const { id, name } = config.contentful.contentType

function up(migration: Migration) {
  const fooType = migration.createContentType(id, {
    name,
    description: "Migrations deployed in this environment",
    displayField: "fileName",
  })

  fooType
    .createField("fileName")
    .name("File Name")
    .type("Symbol")
    .required(true)
}

export default up as MigrationFunction
