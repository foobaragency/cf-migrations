import yargs, { CommandModule } from "yargs"
import { config as loadEnv } from "dotenv"
import { hideBin } from "yargs/helpers"

import * as create from "./commands/create"
import * as deploy from "./commands/deploy"
import * as init from "./commands/init"
import * as release from "./commands/release"
import * as copy from "./commands/copy"

loadEnv()

const commands = [
  create,
  deploy,
  init,
  release,
  copy,
] as unknown as CommandModule[]

export default yargs(hideBin(process.argv))
  .command(commands)
  .demandCommand(1, "You need to specify a command")
  .strictCommands()
  .help("h")
  .alias("h", "help").argv
