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

export const command = "copy"

export const desc = "Copy resources between environments"

export const builder = (yargs: Argv<{}>) =>
  yargs
    .command({
      command: "workflows",
      describe: "Copy workflow definitions between environments",
      builder: (workflowsYargs: Argv<{}>) =>
        contentfulCredentialOptions(workflowsYargs)
          .option("targetEnv", {
            alias: ["contentful-target-environment-id", "target-env", "te"],
            type: "string",
            description: "Target environment to copy workflow definitions to",
          })
          .demandOption(["targetEnv"]),
      handler: (args: CopyWorkflowsArgs) =>
        executeHandler(() =>
          copyWorkflow({
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
        ),
    })
    .demandCommand(1, "You need to specify what to copy")

export const handler = () => undefined
