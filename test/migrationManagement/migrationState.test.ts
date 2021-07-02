import {
  generateMigrationStates,
  getPendingMigrations,
} from "../../lib/migrationManagement/migrationState"
import { config } from "../config"

describe("Migration State", () => {
  it("generates a valid migration state update based on the pending migrations", () => {
    const pendingMigrations = ["0001-migration", "0002-migration"]
    const runMigrationsResult = [
      { successful: true, fileName: pendingMigrations[0] },
      { successful: true, fileName: pendingMigrations[1] },
    ]
    const migrationStateUpdatePayload = generateMigrationStates(
      pendingMigrations,
      runMigrationsResult
    )

    expect(migrationStateUpdatePayload).toMatchSnapshot()
  })

  it("filters the pending migrations", () => {
    const deployedMigrations = ["0001-migration", "0002-migration"]
    const migrationFileNames = [...deployedMigrations, "0003-migration"]

    const pendingMigrations = getPendingMigrations(
      config.migrationsDirectory,
      deployedMigrations,
      migrationFileNames
    )

    expect(pendingMigrations.map(({ fileName }) => fileName)).toEqual([
      "0003-migration",
    ])
  })
})
