import type {
  CreateWorkflowDefinitionProps,
  WorkflowDefinitionProps,
} from "contentful-management"

import { info, warn } from "../logger"
import type { ContentfulPartialOptions } from "../types"

import { getClient } from "./client"

export async function getWorkflowDefinitionsFromEnvironment(
  options: ContentfulPartialOptions,
  environment: string
): Promise<WorkflowDefinitionProps[]> {
  const { spaceId } = options

  const result: WorkflowDefinitionProps[] = []
  const client = getClient(options)
  const limit = 100
  let skip = 0
  let total = 0

  do {
    const response = await client.workflowDefinition.getMany({
      spaceId,
      environmentId: environment,
      query: { limit, skip },
    })

    result.push(...response.items)
    total = response.total
    skip += limit

    info(
      `Get workflowDefinitions - processed items: ${result.length} from ${total}`
    )
  } while (result.length < total)

  return result
}

function toCreateWorkflowDefinitionProps(
  workflowDefinition: WorkflowDefinitionProps
): CreateWorkflowDefinitionProps {
  return {
    name: workflowDefinition.name,
    description: workflowDefinition.description,
    appliesTo: workflowDefinition.appliesTo,
    startOnEntityCreation: workflowDefinition.startOnEntityCreation,
    flowType: workflowDefinition.flowType,
    // Steps must be created without their existing `id` so Contentful assigns
    // fresh ones in the target environment.
    steps: workflowDefinition.steps.map(({ id: _id, ...step }) => step),
  }
}

export async function copyWorkflowDefinitionsBetweenEnvironments(
  options: ContentfulPartialOptions,
  source: string,
  target: string
) {
  const { spaceId } = options
  const workflowDefinitions = await getWorkflowDefinitionsFromEnvironment(
    options,
    source
  )

  if (workflowDefinitions.length === 0) {
    info(`No workflow definitions found in environment ${source} to copy.`)

    return
  }

  const client = getClient(options)

  const existingWorkflowDefinitions =
    await getWorkflowDefinitionsFromEnvironment(options, target)
  const existingNames = new Set(
    existingWorkflowDefinitions.map(({ name }) => name)
  )

  for (const workflowDefinition of workflowDefinitions) {
    if (existingNames.has(workflowDefinition.name)) {
      info(
        `Skipping workflow definition "${workflowDefinition.name}" - already exists in environment ${target}`
      )
      continue
    }

    try {
      await client.workflowDefinition.create(
        { spaceId, environmentId: target },
        toCreateWorkflowDefinitionProps(workflowDefinition)
      )
      // Track the name so duplicates within the source are not created twice.
      existingNames.add(workflowDefinition.name)
      info(
        `Copied workflow definition "${workflowDefinition.name}" to environment ${target}`
      )
    } catch (reason) {
      warn(
        `Could not copy workflow definition "${
          workflowDefinition.name
        }": ${JSON.stringify(reason, null, 2)}`
      )
    }
  }
}
