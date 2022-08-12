import { basename } from "path"

import {
  getMigrationFileData,
  getNextMigrationFileName,
  processMigrationFileNames,
} from "../../lib/migrationManagement/migrationFiles"
import { config } from "../config"

describe("Migration Files", () => {
  it("assure migration files are sorted accordingly to the migration numbers", async () => {
    const migrations = [
      "0002-migration",
      "1660226256621-migration",
      "0001-migration",
      "1660226254499-migration",
      "0003-migration",
      "1660226255228-migration",
    ]
    const processedMigrations = await processMigrationFileNames(
      config.migrationsDirectory,
      migrations
    )

    expect(processedMigrations[0]).toEqual("0001-migration")
    expect(processedMigrations[1]).toEqual("0002-migration")
    expect(processedMigrations[2]).toEqual("0003-migration")
    expect(processedMigrations[3]).toEqual("1660226254499-migration")
    expect(processedMigrations[4]).toEqual("1660226255228-migration")
    expect(processedMigrations[5]).toEqual("1660226256621-migration")
  })

  describe("when getting the next migration file name", () => {
    describe("when there are migration files", () => {
      const migrationFileNames = [
        "0001-migration",
        "0002-migration",
        "1660226254499-migration",
      ]
      const nextMigrationFileName = getNextMigrationFileName(
        "migration",
        migrationFileNames
      )

      it("number should be higher than the last one", () => {
        expect(Number(nextMigrationFileName.split("-")[0])).toBeGreaterThan(
          Number("1660226254499-migration".split("-")[0])
        )
      })
    })

    describe("when there are no migration files", () => {
      const nextMigrationFileName = getNextMigrationFileName("migration", [])

      it("starts the sequence in one", () => {
        expect(nextMigrationFileName).not.toBeNull()
      })
    })

    describe("when there are migrations with invalid sequence", () => {
      const migrationFileNames = [
        "0001-migration",
        "1660226254499-migration",
        "invalid-migration",
      ]

      it("throws an error", () => {
        expect(() =>
          getNextMigrationFileName("migration", migrationFileNames)
        ).toThrowError()
      })
    })
  })

  describe("when getting migration file data with sequence number", () => {
    const migrationsDir = "migrations"
    const migrationFileName = "0001-migration"

    describe("when creating a javascript migration file", () => {
      const useJavascript = true

      it("returns the expected data", () => {
        const migrationData = getMigrationFileData(
          migrationsDir,
          migrationFileName,
          useJavascript
        )

        expect(migrationData.content).toMatchSnapshot()
        expect(basename(migrationData.path)).toEqual("0001-migration.js")
      })
    })

    describe("when creating a typescript migration file", () => {
      const useJavascript = false

      it("returns the expected data", () => {
        const migrationData = getMigrationFileData(
          migrationsDir,
          migrationFileName,
          useJavascript
        )

        expect(migrationData.content).toMatchSnapshot()
        expect(basename(migrationData.path)).toEqual("0001-migration.ts")
      })
    })
  })

  describe("when getting migration file data with timestamp", () => {
    const migrationsDir = "migrations"
    const migrationFileName = "1660226254499-migration"

    describe("when creating a javascript migration file", () => {
      const useJavascript = true

      it("returns the expected data", () => {
        const migrationData = getMigrationFileData(
          migrationsDir,
          migrationFileName,
          useJavascript
        )

        expect(migrationData.content).toMatchSnapshot()
        expect(basename(migrationData.path)).toEqual(
          "1660226254499-migration.js"
        )
      })
    })

    describe("when creating a typescript migration file", () => {
      const useJavascript = false

      it("returns the expected data", () => {
        const migrationData = getMigrationFileData(
          migrationsDir,
          migrationFileName,
          useJavascript
        )

        expect(migrationData.content).toMatchSnapshot()
        expect(basename(migrationData.path)).toEqual(
          "1660226254499-migration.ts"
        )
      })
    })
  })
})
