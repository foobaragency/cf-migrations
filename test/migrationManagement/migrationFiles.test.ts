import {
  getNextMigrationFileName,
  processMigrationFileNames,
} from "../../lib/migrationManagement/migrationFiles"
import { config } from "../config"

describe("Migration Files", () => {
  it("assure migration files are sorted accordingly to the migration numbers", async () => {
    const migrations = ["0002-migration", "0001-migration", "0003-migration"]
    const processedMigrations = await processMigrationFileNames(
      config.migrationsDirectory,
      migrations
    )

    expect(processedMigrations[0]).toEqual("0001-migration")
    expect(processedMigrations[1]).toEqual("0002-migration")
    expect(processedMigrations[2]).toEqual("0003-migration")
  })

  describe("when getting the next migration file name", () => {
    describe("when there are migration files", () => {
      const migrationFileNames = ["0001-migration", "0002-migration"]
      const nextMigrationFileName = getNextMigrationFileName(
        "migration",
        migrationFileNames
      )

      it("increases the sequence by one", () => {
        expect(nextMigrationFileName).toEqual("0003-migration")
      })
    })

    describe("when there are no migration files", () => {
      const nextMigrationFileName = getNextMigrationFileName("migration", [])

      it("starts the sequence in one", () => {
        expect(nextMigrationFileName).toEqual("0001-migration")
      })
    })

    describe("when there are migrations with invalid sequence", () => {
      const migrationFileNames = ["0001-migration", "invalid-migration"]

      it("throws an error", () => {
        expect(() =>
          getNextMigrationFileName("migration", migrationFileNames)
        ).toThrowError()
      })
    })
  })
})
