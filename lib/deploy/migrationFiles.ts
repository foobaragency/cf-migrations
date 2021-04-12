import path from "path"

import globby from "globby"

import { MigrationOptions } from "../types"

export async function processMigrationFileNames(
  options: MigrationOptions,
  migrationNames?: string[]
) {
  const migrationFileNames =
    migrationNames || (await getMigrationFileNames(options.migrationsDirectory))
  migrationFileNames.sort((a, b) => a.localeCompare(b))

  return migrationFileNames
}

async function getMigrationFileNames(migrationsDirectory: string) {
  const pattern = `${getMigrationsDirectoryPath(migrationsDirectory)}/**/*.ts`
  const files = await globby(pattern)

  return files.map(file => path.basename(file))
}

export function getMigrationFilePaths(
  migrationsDirectory: string,
  migrationNames: string[]
) {
  const directoryPath = getMigrationsDirectoryPath(migrationsDirectory)

  return migrationNames.map(name => `${directoryPath}/${name}`)
}

function getMigrationsDirectoryPath(migrationsDirectory: string) {
  return path.join(process.cwd(), migrationsDirectory)
}
