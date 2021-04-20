#!/usr/bin/env bash
set -ex

rm docs/generated/API.md

npx typedoc lib/index.ts \
  --out docs/generated \
  --hideBreadcrumbs true \
  --name "cf-migrations API"

rm docs/generated/README.md
mv docs/generated/modules.md docs/generated/API.md
