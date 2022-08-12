import { errorMessages } from "../../lib/errorMessages"
import { getMigrationDetailsAndValidate } from "../../lib/migrationManagement/migrationValidations"

describe("Migration Validation", () => {
  describe("when all the migration names are correct", () => {
    const migrations = [
      "0001-migration",
      "0002-migration",
      "0003-migration",
      "1660226254499-migration",
      "1660226255228-migration",
      "1660226256621-migration",
    ]

    it("throws no error", () => {
      expect(() =>
        getMigrationDetailsAndValidate(migrations)
      ).not.toThrowError()
    })
  })

  describe("when there're migrations with an invalid name", () => {
    it("throws an invalid name error", () => {
      const migrations = [
        "0001-migration",
        "1660226254499-migration",
        "invalid-migration",
        "0003-migration",
        "1660226255228-migration",
        "1660226256621-migration",
      ]

      expect(() => getMigrationDetailsAndValidate(migrations)).toThrowError(
        errorMessages.migration.invalidNameFormat("invalid-migration")
      )
    })

    describe("when multiple migrations have invalid names", () => {
      it("also throws an invalid name error", () => {
        const migrations = [
          "1660226255228-migration",
          "1660226256621-migration",
          "invalid-migration",
          "another-invalid-migration",
          "0003-migration",
          "1660226254499-migration",
        ]

        expect(() => getMigrationDetailsAndValidate(migrations)).toThrowError(
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

  describe("when there're duplicated migration sequence", () => {
    const migrations = [
      "0001-migration",
      "0003-migration",
      "0003-duplicated-migration-sequence",
    ]

    it("throws an error showing the duplicated migration sequence", () => {
      expect(() => getMigrationDetailsAndValidate(migrations)).toThrowError(
        errorMessages.migration.duplicatedTimestamp(
          "0003-duplicated-migration-sequence"
        )
      )
    })
  })

  describe("when there're duplicated migration timestamps", () => {
    const migrations = [
      "1660226254499-migration",
      "1660226255228-migration",
      "1660226255228-duplicated-migration-timestamp",
    ]

    it("throws an error showing the duplicated migration timestamp", () => {
      expect(() => getMigrationDetailsAndValidate(migrations)).toThrowError(
        errorMessages.migration.duplicatedTimestamp(
          "1660226255228-duplicated-migration-timestamp"
        )
      )
    })
  })
})
