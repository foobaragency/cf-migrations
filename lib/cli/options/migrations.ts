import { Argv } from "yargs"

export function migrationsPathOptions(yargs: Argv<{}>) {
  return yargs
    .env()
    .option("migrationsDir", {
      alias: ["p"],
      type: "string",
      description: "Migrations folder path",
    })
    .demandOption(["migrationsDir"])
}
