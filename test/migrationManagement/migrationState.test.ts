import {
  getPendingMigrations,
  toMigrationState,
} from "../../lib/migrationManagement/migrationState"
import { config } from "../config"

describe("Migration State", () => {
  it("builds a migration state entry for the given locale", () => {
    expect(toMigrationState("0001-migration", "de-DE")).toEqual({
      fileName: { "de-DE": "0001-migration" },
    })
  })

  it("falls back to the default locale when none is provided", () => {
    expect(toMigrationState("1660226256621-migration")).toEqual({
      fileName: { "en-US": "1660226256621-migration" },
    })
  })

  it("filters the pending migrations", () => {
    const deployedMigrations = [
      "0001-migration",
      "0002-migration",
      "1660226256621-migration",
    ]
    const migrationFileNames = [
      ...deployedMigrations,
      "0003-migration",
      "1660226254499-migration",
      "1660226255228-migration",
    ]

    const pendingMigrations = getPendingMigrations(
      config.migrationsDirectory,
      deployedMigrations,
      migrationFileNames
    )

    expect(pendingMigrations.map(({ fileName }) => fileName)).toEqual([
      "0003-migration",
      "1660226254499-migration",
      "1660226255228-migration",
    ])
  })
})
