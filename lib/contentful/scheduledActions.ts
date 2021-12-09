import { CursorPaginatedCollectionProp } from "contentful-management/dist/typings/common-types"
import { ScheduledActionProps } from "contentful-management"
import { CreateUpdateScheduledActionProps } from "contentful-management/dist/typings/entities/scheduled-action"
import chunk from "lodash/chunk"

import { info, warn } from "../logger"

import { getClient } from "./client"

import { ContentfulPartialOptions } from "lib/types"

export async function getScheduledActionsFromEnvironment(
  options: ContentfulPartialOptions,
  environment: string
): Promise<ScheduledActionProps[]> {
  const { spaceId } = options

  const result: ScheduledActionProps[] = []
  const client = getClient(options)
  let pageNext
  let index = 0

  const query = {
    "environment.sys.id": environment,
    "sys.status": "scheduled",
    limit: 100,
  }

  do {
    const response: CursorPaginatedCollectionProp<ScheduledActionProps> =
      await client.scheduledActions.getMany({
        spaceId,
        query: {
          ...query,
          ...(pageNext ? { pageNext } : {}),
        },
      })

    // add items to result
    result.push(...response.items)

    // update pageNext token with value from response
    pageNext = response.pages?.next?.split("pageNext=")[1]
    index++

    info(
      `Get scheduledActions - page: ${index} - processed items: ${result.length}`
    )
  } while (pageNext !== undefined)

  return result
}

export async function createScheduledActionsForEnvironment(
  options: ContentfulPartialOptions,
  scheduledActionProps: CreateUpdateScheduledActionProps[],
  rateLimit: number
) {
  const { spaceId } = options

  const results = []

  // Chunk the request because there is a rate limit
  // Content Management API (CMA) calls - 10 - Calls per second
  // https://www.contentful.com/developers/docs/technical-limits/#enterprise-tier
  // only use half of the rate limit so the service is still available for other requests
  const chunkSize = Math.floor(rateLimit / 2) || 1
  const chunks = chunk(scheduledActionProps, chunkSize)

  for (let i = 0; i < chunks.length; i++) {
    const promises = chunks[i].map(scheduledAction =>
      getClient(options).scheduledActions.create({ spaceId }, scheduledAction)
    )

    const result = await promiseAllSettled(promises)
    results.push(result)

    info(
      `Create scheduledActions - chunk: ${i + 1} from ${
        chunks.length
      } - processed items: ${i * chunkSize + promises.length}`
    )

    // wait a second to comply to the rate limit before processing next chunk
    await delay(1000)
  }

  const result = results.reduce(
    (acc, value) => {
      acc.settled.push(...value.settled)
      acc.values.push(...value.values)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      acc.reasons.push(...value.reasons)

      return acc
    },
    {
      settled: [],
      values: [],
      reasons: [],
    }
  )

  return result
}

export async function deleteScheduledActionsForEnvironment(
  options: ContentfulPartialOptions,
  scheduledActionIds: string[],
  rateLimit: number
) {
  const { spaceId, environmentId } = options
  const results = []

  // Chunk the request because there is a rate limit
  // Content Management API (CMA) calls - 10 - Calls per second
  // https://www.contentful.com/developers/docs/technical-limits/#enterprise-tier
  const chunkSize = Math.floor(rateLimit / 2) || 1
  const chunks = chunk(scheduledActionIds, chunkSize)

  for (let i = 0; i < chunks.length; i++) {
    const promises = chunks[i].map(scheduledActionId =>
      getClient(options).scheduledActions.delete({
        spaceId,
        environmentId,
        scheduledActionId,
      })
    )

    const result = await promiseAllSettled(promises)
    results.push(result)

    info(
      `Remove scheduledActions - chunk: ${i + 1} from ${
        chunks.length
      } - processed items: ${i * chunkSize + promises.length}`
    )

    // wait a second to comply to the rate limit before processing next chunk
    await delay(1000)
  }

  const result = results.reduce(
    (acc, value) => {
      acc.settled.push(...value.settled)
      acc.values.push(...value.values)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      acc.reasons.push(...value.reasons)

      return acc
    },
    {
      settled: [],
      values: [],
      reasons: [],
    }
  )

  return result
}

export async function copyScheduledActionsBetweenReleases(
  options: ContentfulPartialOptions,
  source: string,
  target: string,
  rateLimit: number
) {
  const scheduledActions = await getScheduledActionsFromEnvironment(
    options,
    source
  )

  const scheduledActionProps = scheduledActions.map(scheduledAction => {
    return {
      action: scheduledAction.action,
      entity: scheduledAction.entity,
      environment: {
        sys: {
          id: target,
          linkType: "Environment",
          type: "Link",
        },
      },
      scheduledFor: scheduledAction.scheduledFor,
    } as CreateUpdateScheduledActionProps
  })

  const { reasons } = await createScheduledActionsForEnvironment(
    options,
    scheduledActionProps,
    rateLimit
  )

  if (reasons.length) {
    warn(
      `Some scheduled actions could not be created: ${JSON.stringify(
        reasons,
        null,
        2
      )}`
    )
  }
}

function isPromiseRejectedResult(
  promiseResult: PromiseFulfilledResult<any> | PromiseRejectedResult
): promiseResult is PromiseRejectedResult {
  return (promiseResult as PromiseRejectedResult).status === "rejected"
}

async function promiseAllSettled<T = unknown>(promises: Array<Promise<T>>) {
  const settled = await Promise.allSettled(promises)

  const values = settled.map(result =>
    isPromiseRejectedResult(result) ? undefined : result.value
  )

  const reasons = settled
    .map((result: PromiseFulfilledResult<T> | PromiseRejectedResult) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return isPromiseRejectedResult(result)
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          result.reason.stack || result.reason
        : undefined
    })
    .filter(Boolean)

  return {
    settled,
    values,
    reasons,
  }
}

function delay(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
