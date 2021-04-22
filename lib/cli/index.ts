import yargs from "yargs"
import dotenv from "dotenv"

dotenv.config()

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
