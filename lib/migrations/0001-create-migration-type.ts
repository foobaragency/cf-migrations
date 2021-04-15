import { MigrationFunction } from "contentful-migration"

import { config } from "../config"

const { id, name } = config.contentful.contentType

export = function (migration) {
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
} as MigrationFunction
