import { Argv } from "yargs"

import {
  createDeploymentRelease,
  ReleaseOptions,
} from "../../releaseDeployment"
import { executeHandler } from "../executeHandler"
import { info, success, warn } from "../logger"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"
import { migrationsPathOptions } from "../options/migrations"

type ReleaseArgs = ContentfulCredentialArgs & {
  migrationsPath: string
  prefix: string
  availableEnvironments: number
  ignoreMigrationCheck?: boolean
}

export const desc = "Deploy migrations"

export const builder = (yargs: Argv<{}>) =>
  contentfulCredentialOptions(migrationsPathOptions(yargs))
    .option("prefix", {
      alias: ["cf-release-prefix", "rp"],
      type: "string",
      description: "Prefix of the release environments",
    })
    .option("availableEnvironments", {
      alias: ["contentful-available-environments", "me"],
      type: "number",
      description: "Number of available Contentful Environments",
    })
    .option("ignoreMigrationCheck", {
      alias: ["i"],
      type: "boolean",
      description: "Ignore pending migration check before deploying",
    })
    .demandOption(["prefix", "availableEnvironments"])

export const handler = async (args: ReleaseArgs) => {
  await executeHandler(async () => {
    if (args.env !== "master") {
      warn(
        `Releases are intented to work with 'master' aliases. It might no work when running it against another environment.`
      )
    }

    const releaseOptions = getReleaseOptions(args)
    const releaseEnvironmentId = await createDeploymentRelease(releaseOptions)

    if (releaseEnvironmentId) {
      success(
        `A release ${releaseEnvironmentId} for the environment ${args.env} space ${args.space}`
      )
    } else {
      info(`Skipping release since no pending migration was found`)
    }
  })
}

function getReleaseOptions(args: ReleaseArgs): ReleaseOptions {
  return {
    releasePrefix: args.prefix,
    availableEnvironments: args.availableEnvironments,
    ignoreMigrationCheck: args.ignoreMigrationCheck,
    options: {
      accessToken: args.token,
      environmentId: args.env,
      spaceId: args.space,
      migrationsDirectory: args.migrationsPath,
      locale: args.locale,
    },
  }
}
