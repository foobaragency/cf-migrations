import yargs from "yargs"
import { config as loadEnv } from "dotenv"
import { hideBin } from "yargs/helpers"

import * as create from "./commands/create"
import * as deploy from "./commands/deploy"
import * as init from "./commands/init"
import * as release from "./commands/release"
import * as copyWorkflows from "./commands/copy-workflows"

loadEnv()

const commands = [create, deploy, init, release, copyWorkflows]

export default commands
  .reduce((cli, command) => cli.command(command), yargs(hideBin(process.argv)))
  .demandCommand(1, "You need to specify a command")
  .help("h")
  .alias("h", "help").argv
