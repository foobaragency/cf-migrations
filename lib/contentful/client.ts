import { createClient, PlainClientAPI } from "contentful-management"

import { ContentfulPartialOptions } from "../types"

let client: PlainClientAPI | undefined

export function getClient({ accessToken, host }: ContentfulPartialOptions) {
  if (!client) {
    client = createClient({ accessToken, ...(host && { host }) }, { type: "plain" })
  }

  return client
}
