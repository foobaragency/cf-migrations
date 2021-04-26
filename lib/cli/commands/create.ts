import { Argv } from "yargs"

import { createMigrationFile } from "../../createMigrationFile"
import { executeHandler } from "../executeHandler"
import { success } from "../logger"
import { migrationsPathOptions } from "../options/migrations"

type CreateArgs = {
  name: string
  migrationsDir: string
  useJavascript?: boolean
}

export const command = "create <name>"
export const desc = "Create an empty migration file"

export const builder = (yargs: Argv<{}>) =>
  migrationsPathOptions(yargs)
    .positional("name", {
      describe: "Migration's name",
      type: "string",
    })
    .option("useJavascript", {
      alias: ["js"],
      description: "Generate a javascript migration file",
      type: "boolean",
    })

export const handler = async (args: CreateArgs) =>
  executeHandler(async () => {
    const migrationPath = await createMigrationFile(
      args.migrationsDir,
      args.name,
      args.useJavascript
    )
    success(`New migration created at '${migrationPath}'`)
  })
