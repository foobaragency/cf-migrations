import { processMigrationFileNames } from "../../lib/deploy/migrationFiles"
import { config } from "../config"

describe("Migration Files", () => {
  it("assure migration files are sorted accordingly to the migration numbers", async () => {
    const migrations = ["0002-migration", "0001-migration", "0003-migration"]
    const processedMigrations = await processMigrationFileNames(
      config,
      migrations
    )

    expect(processedMigrations[0]).toEqual("0001-migration")
    expect(processedMigrations[1]).toEqual("0002-migration")
    expect(processedMigrations[2]).toEqual("0003-migration")
  })
})
