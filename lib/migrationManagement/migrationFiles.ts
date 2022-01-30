import path from "path"

import { paramCase } from "change-case"
import fg from "fast-glob"
import last from "lodash/last"

import {
  jsMigrationTemplate,
  tsMigrationTemplate,
} from "../fileManagement/fileTemplates"

import { getMigrationDetailsAndValidate } from "./migrationValidations"

export async function processMigrationFileNames(
  migrationsDir: string,
  migrationNames?: string[]
): Promise<string[]> {
  const migrationFileNames =
    migrationNames || (await getMigrationFileNames(migrationsDir))
  migrationFileNames.sort((a, b) => a.localeCompare(b))

  return migrationFileNames
}

async function getMigrationFileNames(migrationsDirectory: string) {
  const pattern = `${migrationsDirectory}/**/*.{ts,js}`
  const files = await fg(pattern)

  return files.map(file => path.basename(file))
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
  migrationDirectory: string,
  migrationFileName: string,
  useJavascript: boolean
) {
  const fileExtension = useJavascript ? "js" : "ts"
  const migrationPath = path.resolve(
    `${migrationDirectory}/${migrationFileName}.${fileExtension}`
  )
  const content = useJavascript ? jsMigrationTemplate : tsMigrationTemplate

  return { content, path: migrationPath }
}
