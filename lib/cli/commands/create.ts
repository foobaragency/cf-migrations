import { Argv } from "yargs"

import { createMigrationFile } from "../../createMigrationFile"
import { executeHandler } from "../executeHandler"
import { migrationsPathOptions } from "../options/migrations"

type CreateArgs = {
  name: string
  migrationsPath: string
}

export const command = "create <name>"
export const desc = "Create an empty migration file"

export const builder = (yargs: Argv<{}>) =>
  migrationsPathOptions(yargs).positional("name", {
    describe: "Migration's name",
    type: "string",
  })

export const handler = async (args: CreateArgs) =>
  executeHandler(async () =>
    createMigrationFile(args.migrationsPath, args.name)
  )
