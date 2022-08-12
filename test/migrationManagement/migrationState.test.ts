import {
  generateMigrationStates,
  getPendingMigrations,
} from "../../lib/migrationManagement/migrationState"
import { config } from "../config"

describe("Migration State", () => {
  it("generates a valid migration state update based on the pending migrations", () => {
    const pendingMigrations = [
      "0001-migration",
      "1660226256621-migration",
      "0002-migration",
      "0003-migration",
      "0004-migration",
      "1660226254499-migration",
      "1660226255228-migration",
    ]
    const runMigrationsResult = [
      { successful: true, fileName: pendingMigrations[0] },
      { successful: true, fileName: pendingMigrations[1] },
      { successful: true, fileName: pendingMigrations[2] },
      { successful: false, fileName: pendingMigrations[3] },
      { successful: true, fileName: pendingMigrations[4] },
      { successful: true, fileName: pendingMigrations[5] },
      { successful: true, fileName: pendingMigrations[6] },
    ]
    const migrationStateUpdatePayload = generateMigrationStates(
      pendingMigrations,
      runMigrationsResult
    )

    expect(migrationStateUpdatePayload).toMatchSnapshot()
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
