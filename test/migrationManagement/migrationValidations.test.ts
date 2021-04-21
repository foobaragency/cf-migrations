import { errorMessages } from "../../lib/errorMessages"
import { validateMigrations } from "../../lib/migrationManagement/migrationValidations"

describe("Migration Validation", () => {
  describe("when all the migration names are correct", () => {
    const migrations = ["0001-migration", "0002-migration", "0003-migration"]

    it("throws no error", () => {
      expect(() => validateMigrations(migrations)).not.toThrowError()
    })
  })

  describe("when there're migrations with an invalid name", () => {
    it("throws an invalid name error", () => {
      const migrations = [
        "0001-migration",
        "invalid-migration",
        "0003-migration",
      ]

      expect(() => validateMigrations(migrations)).toThrowError(
        errorMessages.migration.invalidNameFormat("invalid-migration")
      )
    })

    describe("when multiple migrations have invalid names", () => {
      it("also throws an invalid name error", () => {
        const migrations = [
          "invalid-migration",
          "another-invalid-migration",
          "0003-migration",
        ]

        expect(() => validateMigrations(migrations)).toThrowError(
          [
            errorMessages.migration.invalidNameFormat("invalid-migration"),
            errorMessages.migration.invalidNameFormat(
              "another-invalid-migration"
            ),
          ].join("\n")
        )
      })
    })
  })

  describe("when there're migration gaps", () => {
    it("thows an error", () => {
      const migrations = ["0001-migration", "0003-migration"]

      expect(() => validateMigrations(migrations)).toThrowError(
        errorMessages.migration.sequenceGap("0003-migration")
      )
    })

    describe("when there're consecutive missing migration files", () => {
      const migrations = ["0001-migration", "0004-migration"]

      it("throws an error showing the migration next to the gap", () => {
        expect(() => validateMigrations(migrations)).toThrowError(
          errorMessages.migration.sequenceGap("0004-migration")
        )
      })
    })

    describe("when there're multiple gaps", () => {
      const migrations = ["0001-migration", "0003-migration", "0005-migration"]

      it("throws an error listing the migration files next to the gaps", () => {
        expect(() => validateMigrations(migrations)).toThrowError(
          [
            errorMessages.migration.sequenceGap("0003-migration"),
            errorMessages.migration.sequenceGap("0005-migration"),
          ].join("\n")
        )
      })
    })
  })

  describe("when there're duplicated migration sequence", () => {
    const migrations = [
      "0001-migration",
      "0003-migration",
      "0003-duplicated-migration-sequence",
    ]

    it("throws an error showing the duplicated migration sequence", () => {
      expect(() => validateMigrations(migrations)).toThrowError(
        errorMessages.migration.duplicatedSequence(
          "0003-duplicated-migration-sequence"
        )
      )
    })
  })
})
