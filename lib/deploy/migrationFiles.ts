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

export function getMigrationsDirectoryPath(migrationsDirectory: string) {
  return path.join(process.cwd(), migrationsDirectory)
}

async function getMigrationFileNames(migrationsDirectory: string) {
  const pattern = `${getMigrationsDirectoryPath(migrationsDirectory)}/**/*.ts`
  const files = await globby(pattern)

  return files.map(file => path.basename(file))
}
