import { Argv } from "yargs"

export function migrationsPathOptions(yargs: Argv<{}>) {
  return yargs
    .env()
    .option("migrationsPath", {
      alias: ["p"],
      type: "string",
      description: "Migrations folder path",
    })
    .demandOption(["migrationsPath"])
}
