import shuffle from "lodash/shuffle"

import {
  getNextReleaseEnvId,
  getOldestUnaliasedReleaseEnvironment,
} from "../../lib/contentful/release"

import { createTestEnvironments } from "./createTestEnvironments"

const releasePrefix = "release-"

describe("getOldestUnaliasedReleaseEnvironment", () => {
  const aliasedEnvironment = "master"

  it("picks the oldest", () => {
    const environments = createTestEnvironments([
      "release-5",
      "release-6",
      "release-7",
    ])
    const result = getOldestUnaliasedReleaseEnvironment(
      releasePrefix,
      aliasedEnvironment,
      environments
    )
    expect(result).toEqual("release-5")
  })

  it("picks the oldest regardless of order", () => {
    const environments = createTestEnvironments([
      "release-5",
      "release-6",
      "release-7",
    ])
    shuffle(environments)
    const result = getOldestUnaliasedReleaseEnvironment(
      releasePrefix,
      aliasedEnvironment,
      environments
    )
    expect(result).toEqual("release-5")
  })

  it("only returns release environments", () => {
    const environments = createTestEnvironments([
      "not-a-release-4",
      "release-5",
      "release-6",
      "release-7",
    ])
    const result = getOldestUnaliasedReleaseEnvironment(
      releasePrefix,
      aliasedEnvironment,
      environments
    )
    expect(result).toEqual("release-5")
  })

  it("ignores aliased releases", () => {
    const environments = createTestEnvironments(
      ["release-5", "release-6", "release-7"],
      { someAlias: "release-5" }
    )
    const result = getOldestUnaliasedReleaseEnvironment(
      releasePrefix,
      aliasedEnvironment,
      environments
    )
    expect(result).toEqual("release-6")
  })

  it("returns undefined if no matching release is found", () => {
    const environments = createTestEnvironments(["release-5"], {
      someAlias: "release-5",
    })
    const result = getOldestUnaliasedReleaseEnvironment(
      releasePrefix,
      aliasedEnvironment,
      environments
    )
    expect(result).toBeUndefined()
  })
})

describe("getNextReleaseEnvId", () => {
  it("returns the newest + 1", () => {
    const environments = createTestEnvironments([
      "release-5",
      "release-6",
      "release-7",
    ])
    const result = getNextReleaseEnvId(releasePrefix, environments)
    expect(result).toEqual("release-8")
  })

  it("returns the newest + 1 regardless of order", () => {
    const environments = createTestEnvironments([
      "release-5",
      "release-6",
      "release-7",
    ])
    shuffle(environments)
    const result = getNextReleaseEnvId(releasePrefix, environments)
    expect(result).toEqual("release-8")
  })

  it("returns release-1 if no release exists yet", () => {
    const result = getNextReleaseEnvId(releasePrefix, [])
    expect(result).toEqual("release-1")
  })

  it("only respects release environments", () => {
    const environments = createTestEnvironments([
      "release-5",
      "release-6",
      "release-7",
      "not-a-release-8",
    ])
    const result = getNextReleaseEnvId(releasePrefix, environments)
    expect(result).toEqual("release-8")
  })

  it("ignores gaps", () => {
    const environments = createTestEnvironments(["release-5", "release-7"])
    const result = getNextReleaseEnvId(releasePrefix, environments)
    expect(result).toEqual("release-8")
  })
})
