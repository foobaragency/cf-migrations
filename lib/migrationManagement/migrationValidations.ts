import { errorMessages } from "../errorMessages"

type MigrationDetails = {
  sequence: number
  fileName: string
}

/**
 * Get migrations sequences and file names while validating them. The names should be sorted.
 */
export function getMigrationDetailsAndValidate(migrationFileNames: string[]) {
  const migrationsDetails = getMigrationsDetails(migrationFileNames)
  const messages: string[] = []

  filterInvalidNameFormat(migrationsDetails).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.invalidNameFormat(fileName))
  )
  filterSequenceGap(migrationsDetails).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.sequenceGap(fileName))
  )
  filterDuplicatedSequence(migrationsDetails).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.duplicatedSequence(fileName))
  )

  if (messages.length > 0) {
    throw new Error(messages.join("\n"))
  }

  return migrationsDetails
}

function getMigrationsDetails(migrationFileNames: string[]) {
  return migrationFileNames.map((name, index) => ({
    fileName: migrationFileNames[index],
    sequence: Number(name.split("-")[0]),
  }))
}

function filterInvalidNameFormat(migrationsInfo: MigrationDetails[]) {
  return migrationsInfo.filter(({ sequence: value }) => isNaN(value))
}

function filterSequenceGap(migrationsInfo: MigrationDetails[]) {
  return migrationsInfo.filter((info, index) => {
    if (index === 0) {
      return false
    }

    return info.sequence - migrationsInfo[index - 1].sequence > 1
  })
}

function filterDuplicatedSequence(migrationsInfo: MigrationDetails[]) {
  const existingSequences: number[] = []

  return migrationsInfo.filter(({ sequence: value }) => {
    if (existingSequences.includes(value)) {
      return true
    }

    existingSequences.push(value)
  })
}
