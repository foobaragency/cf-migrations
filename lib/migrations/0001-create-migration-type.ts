import { MigrationFunction } from "contentful-migration"

export = function (migration) {
  const fooType = migration.createContentType("migration", {
    name: "Migration",
    description: "It's used to manage migration state",
    displayField: "fileName",
  })

  fooType
    .createField("fileName")
    .name("File Name")
    .type("Symbol")
    .required(true)
} as MigrationFunction
