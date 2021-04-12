import { Argv } from "yargs"

import { success, error } from "../logger"
import { deployMigrations } from "../../deploy"

type DeployArgs = {
  env: string
  space: string
  token: string
  migrations: string
  locale?: string
  migrationName?: string
}

export const desc = "Create application"
export const builder = (yargs: Argv<{}>) =>
  yargs
    .option("migrations", {
      alias: "p",
      type: "string",
      description: "Migrations folder path",
    })
    .option("env", {
      alias: "e",
      type: "string",
      description: "Contentful environment ID",
    })
    .option("space", {
      alias: "s",
      type: "string",
      description: "Contentful space ID",
    })
    .option("token", {
      alias: "t",
      type: "string",
      description: "Contentful access token",
    })
    .option("migrationName", {
      alias: "m",
      type: "string",
      description: "Migration name",
    })
    .option("locale", {
      alias: "l",
      type: "string",
      description: "Contentful locale",
    })
    .demandOption(["env", "space", "token", "migrations"])
export const handler = async (args: DeployArgs) => {
  try {
    await deployMigrations(
      {
        accessToken: args.token,
        environmentId: args.env,
        migrationsDirectory: args.migrations,
        spaceId: args.space,
        locale: args.locale,
      },
      args.migrationName ? [args.migrationName] : undefined
    )
    success("🎉 All migrations deployed successfuly!")
  } catch (e) {
    error(`❗️ ${(e as Error).message}`)
  }
}
