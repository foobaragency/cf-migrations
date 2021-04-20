# cf-migrations API

## Table of contents

### Type aliases

- [ContentfulPartialOptions](modules.md#contentfulpartialoptions)
- [MigrationOptions](modules.md#migrationoptions)

### Functions

- [deployMigrations](modules.md#deploymigrations)
- [initEnvironment](modules.md#initenvironment)

## Type aliases

### ContentfulPartialOptions

Ƭ **ContentfulPartialOptions**: _object_

#### Type declaration:

| Name            | Type     |
| :-------------- | :------- |
| `accessToken`   | _string_ |
| `environmentId` | _string_ |
| `locale?`       | _string_ |
| `spaceId`       | _string_ |

Defined in: [types.ts:1](https://github.com/foobaragency/cf-migrations/blob/5b20ce5/lib/types.ts#L1)

---

### MigrationOptions

Ƭ **MigrationOptions**: [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions) & { `migrationsDirectory`: _string_ ; `yes?`: _boolean_ }

Defined in: [types.ts:8](https://github.com/foobaragency/cf-migrations/blob/5b20ce5/lib/types.ts#L8)

## Functions

### deployMigrations

▸ **deployMigrations**(`options`: [_MigrationOptions_](modules.md#migrationoptions), `migrationNames?`: _string_[]): _Promise_<string[]\>

#### Parameters:

| Name              | Type                                              |
| :---------------- | :------------------------------------------------ |
| `options`         | [_MigrationOptions_](modules.md#migrationoptions) |
| `migrationNames?` | _string_[]                                        |

**Returns:** _Promise_<string[]\>

Defined in: [deploy/index.ts:21](https://github.com/foobaragency/cf-migrations/blob/5b20ce5/lib/deploy/index.ts#L21)

---

### initEnvironment

▸ **initEnvironment**(`options`: [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions)): _Promise_<void\>

#### Parameters:

| Name      | Type                                                              |
| :-------- | :---------------------------------------------------------------- |
| `options` | [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions) |

**Returns:** _Promise_<void\>

Defined in: [contentful/initEnvironment.ts:7](https://github.com/foobaragency/cf-migrations/blob/5b20ce5/lib/contentful/initEnvironment.ts#L7)
