export const errorMessages = {
  migration: {
    invalidNameFormat: (file: string) =>
      `Invalid migration name format: ${file}. Unable to determine the migration sequence.`,
    duplicatedTimestamp: (file: string) =>
      `Duplicated migration timestamps: ${file}. Unable to determine the migration sequence.`,
  },
  cli: {
    argument: (option: string, env: string) =>
      `Option ${option} or the environment variable ${env} is missing.`,
  },
} as const
