import { errorMessages } from "../errorMessages"

export type MigrationFileInformation = {
  sequence: number
  fileName: string
}

/**
 * Validate migrations based on their file names. The names should be sorted.
 */
export function validateMigrations(migrationFileNames: string[]) {
  const migrationsInfo = getSequencesFromFileNames(migrationFileNames)
  const messages: string[] = []

  filterInvalidSNameFormat(migrationsInfo).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.invalidNameFormat(fileName))
  )
  filterSequenceGap(migrationsInfo).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.sequenceGap(fileName))
  )
  filterDuplicatedSequence(migrationsInfo).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.duplicatedSequence(fileName))
  )

  if (messages.length > 0) {
    throw new Error(messages.join("\n"))
  }

  return migrationsInfo
}

function getSequencesFromFileNames(migrationFileNames: string[]) {
  return migrationFileNames.map((name, index) => ({
    fileName: migrationFileNames[index],
    sequence: Number(name.split("-")[0]),
  }))
}

function filterInvalidSNameFormat(migrationsInfo: MigrationFileInformation[]) {
  return migrationsInfo.filter(({ sequence: value }) => isNaN(value))
}

function filterSequenceGap(migrationsInfo: MigrationFileInformation[]) {
  return migrationsInfo.filter((info, index) => {
    if (index === 0) {
      return false
    }

    return info.sequence - migrationsInfo[index - 1].sequence > 1
  })
}

function filterDuplicatedSequence(migrationsInfo: MigrationFileInformation[]) {
  const existingSequences: number[] = []

  return migrationsInfo.filter(({ sequence: value }) => {
    if (existingSequences.includes(value)) {
      return true
    }

    existingSequences.push(value)
  })
}
