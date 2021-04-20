#!/usr/bin/env bash
set -ex

npx typedoc lib/index.ts \
  --out docs/generated/ \
  --hideBreadcrumbs true \
  --name "cf-migrations API"

rm docs/generated/README.md
