import { Argv } from "yargs"

import { initEnvironment } from "../../initEnvironment"
import { assessMigrationsTypeExistence } from "../../contentful/management"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"
import { executeHandler } from "../executeHandler"
import { info, success } from "../../logger"

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
        `Skipping initialization since the environment '${args.env}' was already initialized.`
      )

      return
    }

    await initEnvironment(options)

    success(`Space '${args.space}' environment '${args.env}' was initialized.`)
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
