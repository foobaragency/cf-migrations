import { Argv } from "yargs"

import { error, info, success } from "../logger"
import { deployMigrations } from "../../deploy"
import { ContentfulPartialOptions, MigrationOptions } from "../../types"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"
import { executeHandler } from "../executeHandler"
import { assessMigrationsTypeExistence } from "../../contentful/management"
import { migrationsPathOptions } from "../options/migrations"

type DeployArgs = ContentfulCredentialArgs & {
  migrationsDir: string
  yes?: boolean
  migrationName?: string
}

export const desc = "Deploy migrations"

export const builder = (yargs: Argv<{}>) =>
  contentfulCredentialOptions(migrationsPathOptions(yargs))
    .option("migrationName", {
      alias: ["m"],
      type: "string",
      description: "Migration name",
    })
    .option("yes", {
      alias: ["y"],
      type: "boolean",
      default: true,
      description:
        "Automatically confirm migration plans and deploy migrations",
    })

export const handler = async (args: DeployArgs) => {
  await executeHandler(async () => {
    const migrationOptions = getMigrationOptions(args)
    await assureEnvironmentIsInitialized(migrationOptions)
    const migrationNames = args.migrationName ? [args.migrationName] : undefined

    logMigrationPlan(migrationNames)
    const deployedMigrations = await deployMigrations({
      options: migrationOptions,
      migrationNames,
    })
    logMigrationResult(deployedMigrations)
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
  return {
    accessToken: args.token,
    environmentId: args.env,
    spaceId: args.space,
    migrationsDirectory: args.migrationsDir,
    locale: args.locale,
    yes: args.yes,
  }
}

function logMigrationPlan(migrationNames?: string[]) {
  if (!migrationNames) {
    info("Deploying all migrations...")

    return
  }

  migrationNames.forEach(name => info(`Deploying the migration ${name}...`))
}

function logMigrationResult(deployedMigrations: string[]) {
  if (deployedMigrations.length === 0) {
    info("Skipping deploy since all migrations were already deployed!")

    return
  }

  deployedMigrations.forEach(migration =>
    success(`Migration '${migration}' was deployed!`)
  )
}
