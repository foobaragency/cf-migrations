import { Argv } from "yargs"

export type ContentfulCredentialArgs = {
  env: string
  space: string
  token: string
  locale?: string
}

export function contentfulCredentialOptions(yargs: Argv<{}>) {
  return yargs
    .env()
    .option("env", {
      alias: ["contentful-environment-id", "e"],
      type: "string",
      description: "Contentful environment ID",
    })
    .option("space", {
      alias: ["contentful-space-id", "s"],
      type: "string",
      description: "Contentful space ID",
    })
    .option("token", {
      alias: ["contentful-token", "t"],
      type: "string",
      description: "Contentful access token",
    })
    .option("locale", {
      alias: ["contentful-locale", "l"],
      type: "string",
      description: "Contentful locale",
    })
    .demandOption(["env", "space", "token"])
}
