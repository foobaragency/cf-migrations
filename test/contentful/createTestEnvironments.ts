import { EnvironmentProps } from "contentful-management/dist/typings/export-types"
import dayjs from "dayjs"
import timekeeper from "timekeeper"

export function createTestEnvironments(
  names: string[],
  aliases: { [alias: string]: string } = {}
): EnvironmentProps[] {
  timekeeper.freeze(1617901830542)

  const items = names.map(
    (name, index) =>
      ({
        sys: {
          id: name,
          createdAt: dayjs()
            .subtract(names.length - index, "day")
            .toISOString(),
          aliases: Object.entries(aliases)
            .filter(([key, value]) => value === name)
            .map(([key]) => ({
              sys: {
                id: key,
                type: "Link",
                linkType: "EnvironmentAlias",
              },
            })),
        },
        name,
      } as EnvironmentProps)
  )

  timekeeper.reset()

  return items
}
