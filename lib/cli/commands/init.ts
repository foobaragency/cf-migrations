import { Argv } from "yargs"

import { initEnvironment } from "../../contentful/migration"
import { CTMigrationPartialOptions } from "../../types"
import { argumentErrors } from "../argument-errors"
import { validateRequiredArguments } from "../argumentValidation"
import {
  ContentfulCredentials,
  requireContentfulCredentialsOptions,
} from "../contentful-credentials"
import { executeHandler } from "../executeHandler"

export const desc = "Deploy migrations"
export const builder = (yargs: Argv<{}>) =>
  requireContentfulCredentialsOptions(yargs)
export const handler = async (args: ContentfulCredentials) => {
  await executeHandler(async () => {
    const options = getMigrationOptions(args)
    await initEnvironment(options)
  })
}

function getMigrationOptions(args: ContentfulCredentials) {
  const requiredArgs = validateRequiredArguments<CTMigrationPartialOptions>(
    {
      accessToken: args.token || process.env.CONTENTFUL_TOKEN,
      environmentId: args.env || process.env.CONTENTFUL_ENVIRONMENT_ID,
      spaceId: args.space || process.env.CONTENTUL_SPACE_ID,
    },
    argumentErrors.deploy
  )

  return { ...requiredArgs, locale: args.locale }
}
