import path from "path"

import last from "lodash/last"
import { paramCase } from "change-case"
import globby from "globby"

import { getMigrationDetailsAndValidate } from "./migrationValidations"
import { jsMigrationTemplate, tsMigrationTemplate } from "./fileTemplates"

export async function processMigrationFileNames(
  migrationsDir: string,
  migrationNames?: string[]
) {
  const migrationFileNames =
    migrationNames || (await getMigrationFileNames(migrationsDir))
  migrationFileNames.sort((a, b) => a.localeCompare(b))

  return migrationFileNames
}

async function getMigrationFileNames(migrationsDirectory: string) {
  const pattern = `${getMigrationsDirectoryPath(
    migrationsDirectory
  )}/**/*.{ts,js}`
  const files = await globby(pattern)

  return files.map(file => path.basename(file))
}

export function getMigrationFilePaths(
  migrationsDirectory: string,
  migrationName: string
) {
  const directoryPath = getMigrationsDirectoryPath(migrationsDirectory)

  return `${directoryPath}/${migrationName}`
}

export function getMigrationsDirectoryPath(migrationsDirectory: string) {
  return path.join(process.cwd(), migrationsDirectory)
}

export function getNextMigrationFileName(
  name: string,
  migrationFileNames: string[]
) {
  const lastValidMigration = last(
    getMigrationDetailsAndValidate(migrationFileNames)
  )
  const lastSequence = lastValidMigration?.sequence
  const sequence = lastSequence ? lastSequence + 1 : 1
  const sequenceString = String(sequence).padStart(4, "0")

  return `${sequenceString}-${paramCase(name)}`
}

export function getMigrationFileData(
  migrationsDir: string,
  migrationFileName: string,
  useJavascript: boolean
) {
  const fileExtension = useJavascript ? "js" : "ts"
  const path = `${getMigrationsDirectoryPath(
    migrationsDir
  )}/${migrationFileName}.${fileExtension}`
  const content = useJavascript ? jsMigrationTemplate : tsMigrationTemplate

  return { content, path }
}
