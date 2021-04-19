/* eslint-disable no-console */
import chalk from "chalk"

export function info(message: string) {
  console.log(`🔔  ${chalk.blueBright(message)}`)
}

export function success(message: string) {
  console.log(`🎉  ${chalk.greenBright(message)}`)
}

export function error(message: string) {
  console.log(`🛑 ️ ${chalk.redBright(message)}`)
}
