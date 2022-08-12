import path from "path"

import { paramCase } from "change-case"
import fg from "fast-glob"

import { getMigrationDetailsAndValidate } from "./migrationValidations"
import { jsMigrationTemplate, tsMigrationTemplate } from "./fileTemplates"

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
  getMigrationDetailsAndValidate(migrationFileNames)
  const timestamp = new Date().getTime()

  return `${timestamp}-${paramCase(name)}`
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
