import { Argv } from "yargs"

import {
  createReleaseEnvironment,
  ReleaseOptions,
} from "../../createReleaseEnvironment"
import { executeHandler } from "../executeHandler"
import { info } from "../../logger"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"
import { migrationsPathOptions } from "../options/migrations"

type ReleaseArgs = ContentfulCredentialArgs & {
  migrationsDir: string
  prefix: string
  availableEnvironments: number
  ignoreMigrationCheck?: boolean
  environmentCreationSecondsTimeout?: number
}

export const desc = "Deploy migrations"

export const builder = (yargs: Argv<{}>) =>
  contentfulCredentialOptions(migrationsPathOptions(yargs))
    .option("prefix", {
      alias: ["contentful-release-prefix", "rp"],
      type: "string",
      description: "Prefix of the release environments",
    })
    .option("availableEnvironments", {
      alias: ["contentful-available-environments", "ae"],
      type: "number",
      description: "Number of available Contentful Environments",
    })
    .option("ignoreMigrationCheck", {
      alias: ["i"],
      type: "boolean",
      description: "Ignore pending migration check before deploying",
    })
    .option("environmentCreationSecondsTimeout", {
      alias: ["contentful-environment-creation-seconds-timeout"],
      type: "number",
      default: 1,
      description:
        "Maximum of seconds it should wait for the release environment creation to be ready",
    })
    .demandOption(["prefix", "availableEnvironments"])

export const handler = async (args: ReleaseArgs) => {
  await executeHandler(async () => {
    const releaseOptions = getReleaseOptions(args)
    const releaseEnvironmentId = await createReleaseEnvironment(releaseOptions)

    if (!releaseEnvironmentId) {
      info(
        `You can use --ignoreMigrationCheck to create a new release regardless`
      )
    }
  })
}

function getReleaseOptions(args: ReleaseArgs): ReleaseOptions {
  return {
    releasePrefix: args.prefix,
    availableEnvironments: args.availableEnvironments,
    ignoreMigrationCheck: args.ignoreMigrationCheck,
    environmentCreationSecondsTimeout: args.environmentCreationSecondsTimeout,
    options: {
      accessToken: args.token,
      environmentId: args.env,
      spaceId: args.space,
      migrationsDirectory: args.migrationsDir,
      locale: args.locale,
    },
  }
}
