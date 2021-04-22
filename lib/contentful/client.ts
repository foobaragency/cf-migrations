import { createClient, PlainClientAPI } from "contentful-management"

import { ContentfulPartialOptions } from "../types"

let client: PlainClientAPI | undefined

export function getClient({ accessToken }: ContentfulPartialOptions) {
  if (!client) {
    client = createClient({ accessToken }, { type: "plain" })
  }

  return client
}
