import { Argv } from "yargs"

import { copyWorkflow } from "../../copyWorkflow"
import { executeHandler } from "../executeHandler"
import {
  ContentfulCredentialArgs,
  contentfulCredentialOptions,
} from "../options/contentful-credentials"

type CopyWorkflowsArgs = ContentfulCredentialArgs & {
  targetEnv: string
}

export const command = "copy-workflows"

export const desc = "Copy workflow definitions between environments"

export const builder = (yargs: Argv<{}>) =>
  contentfulCredentialOptions(yargs)
    .option("targetEnv", {
      alias: ["contentful-target-environment-id", "target-env", "te"],
      type: "string",
      description: "Target environment to copy workflow definitions to",
    })
    .demandOption(["targetEnv"])

export const handler = async (args: CopyWorkflowsArgs) => {
  await executeHandler(async () => {
    await copyWorkflow({
      sourceEnvironmentId: args.env,
      targetEnvironmentId: args.targetEnv,
      options: {
        accessToken: args.token,
        environmentId: args.env,
        spaceId: args.space,
        locale: args.locale,
        host: args.host,
      },
    })
  })
}
