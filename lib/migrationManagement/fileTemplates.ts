export const tsMigrationTemplate = `import { MigrationFunction } from "contentful-migration"

const up: MigrationFunction = (migration, context) => {
  // Write your migration here
}

export default up

`

export const jsMigrationTemplate = `module.exports = function (migration) {
  // Write your migration here
}

`
