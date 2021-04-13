import { errorMessages } from "../errorMessages"
import { MigrationOptions } from "../types"

import { RequiredKeys } from "./argumentValidation"

type ArgumentErrors = {
  deploy: Record<RequiredKeys<MigrationOptions>, string>
}

const argumentErrorMessage = errorMessages.cli.argument

export const argumentErrors: ArgumentErrors = {
  deploy: {
    accessToken: argumentErrorMessage("--token", "CONTENTFUL_TOKEN"),
    environmentId: argumentErrorMessage("--env", "CONTENTFUL_ENVIRONMENT_ID"),
    spaceId: argumentErrorMessage("--space", "CONTENTUL_SPACE_ID"),
    migrationsDirectory: argumentErrorMessage(
      "--migrationsPath",
      "MIGRATIONS_PATH"
    ),
  },
}
