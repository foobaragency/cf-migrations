import yargs, { Argv } from "yargs"

import { info, success, error } from "../logger"
import { deployMigrations } from "../../deploy"
import { MigrationOptions } from "../../types"
import { validateRequiredArguments } from "../argumentValidation"
import { argumentErrors } from "../argument-errors"
import {
  ContentfulCredentials,
  requireContentfulCredentialsOptions,
} from "../contentful-credentials"

type DeployArgs = ContentfulCredentials & {
  migrationsPath?: string
  migrationName?: string
}

export const desc = "Deploy migrations"
export const builder = (yargs: Argv<{}>) =>
  requireContentfulCredentialsOptions(yargs)
    .option("migrationsPath", {
      alias: "p",
      type: "string",
      description: "Migrations folder path",
    })
    .option("migrationName", {
      alias: "m",
      type: "string",
      description: "Migration name",
    })
export const handler = async (args: DeployArgs) => {
  try {
    const migrationOptions = processArgs(args)
    const migrationNames = args.migrationName ? [args.migrationName] : undefined

    migrationNames?.forEach(name => info(`Deploying the migration ${name}`))

    await deployMigrations(migrationOptions, migrationNames)

    success("All migrations deployed successfuly!")
  } catch (e) {
    error((e as Error).message)

    yargs.showHelp()
  }
}

function processArgs(args: DeployArgs): MigrationOptions {
  const requiredArgs = validateRequiredArguments<MigrationOptions>(
    {
      accessToken: args.token || process.env.CONTENTFUL_TOKEN,
      environmentId: args.env || process.env.CONTENTFUL_ENVIRONMENT_ID,
      spaceId: args.space || process.env.CONTENTUL_SPACE_ID,
      migrationsDirectory: args.migrationsPath || process.env.MIGRATIONS_PATH,
    },
    argumentErrors.deploy
  )

  return { ...requiredArgs, locale: args.locale }
}
