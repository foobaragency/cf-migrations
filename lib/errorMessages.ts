export const errorMessages = {
  migration: {
    invalidNameFormat: (file: string) =>
      `Invalid migration name format: ${file}. Unable to determine the migration sequence`,
    sequenceGap: (file: string) =>
      `There's a migration gap before the file ${file}. Missing migration files.`,
    duplicatedSequence: (file: string) =>
      `Duplicated migration sequence: ${file}. Unable to determine the migration sequence.`,
  },
  cli: {
    argument: (option: string, env: string) =>
      `Option ${option} or the environment variable ${env} is missing.`,
  },
} as const
