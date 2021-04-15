import { Argv } from "yargs"

import { initEnvironment } from "../../contentful/initEnvironment"
import { assessMigrationsTypeExistence } from "../../contentful/management"
import { ContentfulPartialOptions } from "../../types"
import { argumentErrors } from "../argument-errors"
import { validateRequiredArguments } from "../argumentValidation"
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
    const options = getMigrationOptions(args)
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

function getMigrationOptions(args: ContentfulCredentials) {
  const requiredArgs = validateRequiredArguments<ContentfulPartialOptions>(
    {
      accessToken: args.token || process.env.CONTENTFUL_TOKEN,
      environmentId: args.env || process.env.CONTENTFUL_ENVIRONMENT_ID,
      spaceId: args.space || process.env.CONTENTUL_SPACE_ID,
    },
    argumentErrors.deploy
  )

  return { ...requiredArgs, locale: args.locale }
}
