import { Argv } from "yargs"

export type ContentfulCredentials = {
  env?: string
  space?: string
  token?: string
  locale?: string
}

export function requireContentfulCredentialsOptions(yargs: Argv<{}>) {
  return yargs
    .option("env", {
      alias: "e",
      type: "string",
      description: "Contentful environment ID",
    })
    .option("space", {
      alias: "s",
      type: "string",
      description: "Contentful space ID",
    })
    .option("token", {
      alias: "t",
      type: "string",
      description: "Contentful access token",
    })
    .option("locale", {
      alias: "l",
      type: "string",
      description: "Contentful locale",
    })
}
