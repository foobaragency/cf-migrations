import { error } from "./logger"

export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

export function validateRequiredArguments<T = unknown>(
  requiredArgs: Partial<T>,
  argumentErrors: Record<RequiredKeys<T>, string>
): T {
  const missingArgs: Array<RequiredKeys<T>> = []

  if (!hasAllRequiredArguments(requiredArgs, missingArgs)) {
    missingArgs.forEach(missingArg => error(argumentErrors[missingArg]))

    throw new Error("Some required arguments are missing")
  }

  return requiredArgs
}

function hasAllRequiredArguments<T>(
  partialArgs: Partial<T>,
  missingArgs: Array<RequiredKeys<T>>
): partialArgs is T {
  const keys = Object.keys(partialArgs) as Array<RequiredKeys<T>>
  missingArgs.push(...keys.filter(key => partialArgs[key] === undefined))

  return missingArgs.length === 0
}
