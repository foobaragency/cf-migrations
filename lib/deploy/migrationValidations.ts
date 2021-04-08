import { errorMessages } from "../errorMessages"

type MigrationSequence = {
  value: number
  fileName: string
}

/**
 * Validate migrations based on their file names. The names should be sorted.
 */
export function validateMigrations(migrationFileNames: string[]) {
  const sequences = getSequencesFromFileNames(migrationFileNames)
  const messages: string[] = []

  filterInvalidSNameFormat(sequences).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.invalidNameFormat(fileName))
  )
  filterSequenceGap(sequences).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.sequenceGap(fileName))
  )
  filterDuplicatedSequence(sequences).forEach(({ fileName }) =>
    messages.push(errorMessages.migration.duplicatedSequence(fileName))
  )

  if (messages.length > 0) {
    throw new Error(messages.join("\n"))
  }
}

function getSequencesFromFileNames(migrationFileNames: string[]) {
  return migrationFileNames
    .map(name => name.slice(0, 4))
    .map((value, index) => ({
      fileName: migrationFileNames[index],
      value: Number(value),
    }))
}

function filterInvalidSNameFormat(sequences: MigrationSequence[]) {
  return sequences.filter(({ value }) => isNaN(value))
}

function filterSequenceGap(sequences: MigrationSequence[]) {
  return sequences.filter((sequence, index) => {
    if (index === 0) {
      return false
    }

    return sequence.value - sequences[index - 1].value > 1
  })
}

function filterDuplicatedSequence(sequences: MigrationSequence[]) {
  const existingSequences: number[] = []

  return sequences.filter(({ value }) => {
    if (existingSequences.includes(value)) {
      return true
    }

    existingSequences.push(value)
  })
}
