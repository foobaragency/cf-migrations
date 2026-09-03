import yargs from "yargs"
import { config as loadEnv } from "dotenv"

loadEnv()

export default yargs
  .commandDir("commands")
  .help("h")
  .alias("h", "help")
  .command({
    command: "*",
    handler() {
      yargs.showHelp()
    },
  }).argv
