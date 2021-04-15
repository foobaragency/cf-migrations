import { Argv } from "yargs"

import { error, info, success } from "../logger"
import { deployMigrations } from "../../deploy"
import { ContentfulPartialOptions, MigrationOptions } from "../../types"
import { validateRequiredArguments } from "../argumentValidation"
import { argumentErrors } from "../argument-errors"
import {
  ContentfulCredentials,
  requireContentfulCredentialsOptions,
} from "../contentful-credentials"
import { executeHandler } from "../executeHandler"
import { assessMigrationsTypeExistence } from "../../contentful/management"

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
  await executeHandler(async () => {
    const migrationOptions = getMigrationOptions(args)
    await assureEnvironmentIsInitialized(migrationOptions)
    const migrationNames = args.migrationName ? [args.migrationName] : undefined

    migrationNames?.forEach(name => info(`Deploying the migration ${name}`))

    await deployMigrations(migrationOptions, migrationNames)

    success("All migrations deployed successfuly!")
  })
}

async function assureEnvironmentIsInitialized(
  options: ContentfulPartialOptions
) {
  const isEnvironmentInitialized = await assessMigrationsTypeExistence(options)

  if (!isEnvironmentInitialized) {
    error(
      `Space ${options.spaceId} environment ${options.environmentId} was not initialized. Run cf-migrations init first.`
    )
    process.exit(1)
  }
}

function getMigrationOptions(args: DeployArgs): MigrationOptions {
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
