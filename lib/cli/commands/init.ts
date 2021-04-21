import { Argv } from "yargs"

import { initEnvironment } from "../../initEnvironment"
import { assessMigrationsTypeExistence } from "../../contentful/management"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"
import { executeHandler } from "../executeHandler"
import { info, success } from "../logger"

export const desc = "Init Contentful environment to support migrations"

export const builder = (yargs: Argv<{}>) => contentfulCredentialOptions(yargs)

export const handler = async (args: ContentfulCredentialArgs) => {
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

    success(
      `Space ${options.spaceId} environment ${options.environmentId} was initialized.`
    )
  })
}

function mapMigrationOptions(args: ContentfulCredentialArgs) {
  return {
    accessToken: args.token,
    environmentId: args.env,
    spaceId: args.space,
    locale: args.locale,
  }
}
