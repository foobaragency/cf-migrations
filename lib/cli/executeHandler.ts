import { error } from "../logger"

export async function executeHandler(handler: () => Promise<unknown>) {
  try {
    await handler()
  } catch (e) {
    error((e as Error).stack || (e as Error).message)

    process.exit(1)
  }
}
