import { MigrationFunction } from "contentful-migration"

import { config } from "../config"

const { id, name } = config.contentful.contentType

export = function (migration) {
  const fooType = migration.createContentType(id, {
    name,
    description: "It's used to manage migration state",
    displayField: "fileName",
  })

  fooType
    .createField("fileName")
    .name("File Name")
    .type("Symbol")
    .required(true)
} as MigrationFunction
