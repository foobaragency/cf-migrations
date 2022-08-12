import { errorMessages } from "../errorMessages"

type MigrationDetails = {
  timestamp: number
  fileName: string
}

/**
 * Get migrations timestamp and file names while validating them. The names should be sorted.
 */
export function getMigrationDetailsAndValidate(migrationFileNames: string[]) {
  const migrationsDetails = getMigrationsDetails(migrationFileNames)
  const messages: string[] = []

  filterInvalidNameFormat(migrationsDetails).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.invalidNameFormat(fileName))
  )
  filterDuplicatedTimestamp(migrationsDetails).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.duplicatedTimestamp(fileName))
  )

  if (messages.length > 0) {
    throw new Error(messages.join("\n"))
  }

  return migrationsDetails
}

function getMigrationsDetails(migrationFileNames: string[]) {
  return migrationFileNames.map(name => ({
    fileName: name,
    timestamp: Number(name.split("-")[0]),
  }))
}

function filterInvalidNameFormat(migrationsInfo: MigrationDetails[]) {
  return migrationsInfo.filter(({ timestamp: value }) => isNaN(value))
}

function filterDuplicatedTimestamp(migrationsInfo: MigrationDetails[]) {
  const existingTimestamps: number[] = []

  return migrationsInfo.filter(({ timestamp: value }) => {
    if (existingTimestamps.includes(value)) {
      return true
    }

    existingTimestamps.push(value)
  })
}
