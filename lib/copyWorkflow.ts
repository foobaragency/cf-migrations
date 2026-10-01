import { copyWorkflowDefinitionsBetweenEnvironments } from "./contentful/workflows"
import { success } from "./logger"
import type { ContentfulPartialOptions } from "./types"

export type CopyWorkflowOptions = {
  sourceEnvironmentId: string
  targetEnvironmentId: string
  options: ContentfulPartialOptions
}

export async function copyWorkflow({
  sourceEnvironmentId,
  targetEnvironmentId,
  options,
}: CopyWorkflowOptions) {
  await copyWorkflowDefinitionsBetweenEnvironments(
    options,
    sourceEnvironmentId,
    targetEnvironmentId
  )

  success(
    `Workflow definitions copied from ${sourceEnvironmentId} to ${targetEnvironmentId}`
  )
}
