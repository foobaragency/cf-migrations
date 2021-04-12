import yargs from "yargs"

export default yargs.commandDir("commands").help("h").alias("h", "help").argv
