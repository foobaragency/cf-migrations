import {
  generateMigrationStates,
  getPendingMigrationFilePaths,
} from "../../lib/migrationManagement/migrationState"
import { config } from "../config"

describe("Migration State", () => {
  it("generates a valid migration state update based on the pending migrations", () => {
    const pendingMigrations = ["0001-migration", "0002-migration"]
    const migrationStateUpdatePayload = generateMigrationStates(
      pendingMigrations
    )

    expect(migrationStateUpdatePayload).toMatchSnapshot()
  })

  it("filters the pending migrations", () => {
    const deployedMigrations = ["0001-migration", "0002-migration"]
    const migrationFileNames = [...deployedMigrations, "0003-migration"]

    const { pendingMigrations } = getPendingMigrationFilePaths(
      config.migrationsDirectory,
      deployedMigrations,
      migrationFileNames
    )

    expect(pendingMigrations).toEqual(["0003-migration"])
  })
})
