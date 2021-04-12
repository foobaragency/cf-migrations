/* eslint-disable no-console */
import chalk from "chalk"

export function success(message: string) {
  console.log(chalk.greenBright(message))
}

export function error(message: string) {
  console.log(chalk.red(message))
}
