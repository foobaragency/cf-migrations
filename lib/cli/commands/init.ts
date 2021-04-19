import { Argv } from "yargs"

import { initEnvironment } from "../../contentful/initEnvironment"
import { assessMigrationsTypeExistence } from "../../contentful/management"
import {
  ContentfulCredentials,
  requireContentfulCredentialsOptions,
} from "../contentful-credentials"
import { executeHandler } from "../executeHandler"
import { info } from "../logger"

export const desc = "Init Contentful environment to support migrations"

export const builder = (yargs: Argv<{}>) =>
  requireContentfulCredentialsOptions(yargs)

export const handler = async (args: ContentfulCredentials) => {
  await executeHandler(async () => {
    const options = mapMigrationOptions(args)
    const isEnvironmentInitialized = await assessMigrationsTypeExistence(
      options
    )

    if (isEnvironmentInitialized) {
      info(
        `Space ${options.spaceId} environment ${options.environmentId} was already initialized.`
      )
      process.exit(0)
    }

    await initEnvironment(options)
  })
}

function mapMigrationOptions(args: ContentfulCredentials) {
  return {
    accessToken: args.token,
    environmentId: args.env,
    spaceId: args.space,
    locale: args.locale,
  }
}
