# cf-migrations API

## Table of contents

### Type aliases

- [ContentfulPartialOptions](modules.md#contentfulpartialoptions)
- [CopyWorkflowOptions](modules.md#copyworkflowoptions)
- [DeployOptions](modules.md#deployoptions)
- [MigrationOptions](modules.md#migrationoptions)
- [ReleaseOptions](modules.md#releaseoptions)

### Functions

- [copyWorkflow](modules.md#copyworkflow)
- [createReleaseEnvironment](modules.md#createreleaseenvironment)
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

Defined in: [types.ts:1](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/types.ts#L1)

---

### CopyWorkflowOptions

Ƭ **CopyWorkflowOptions**: _object_

#### Type declaration:

| Name                  | Type                                                              |
| :-------------------- | :--------------------------------------------------------------- |
| `options`             | [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions) |
| `sourceEnvironmentId` | _string_                                                         |
| `targetEnvironmentId` | _string_                                                         |

Defined in: [copyWorkflow.ts:5](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/copyWorkflow.ts#L5)

---

### DeployOptions

Ƭ **DeployOptions**: _object_

#### Type declaration:

| Name                  | Type                                              |
| :-------------------- | :------------------------------------------------ |
| `deployedMigrations?` | _string_[]                                        |
| `migrationNames?`     | _string_[]                                        |
| `options`             | [_MigrationOptions_](modules.md#migrationoptions) |

Defined in: [deploy.ts:15](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/deploy.ts#L15)

---

### MigrationOptions

Ƭ **MigrationOptions**: [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions) & { `migrationsDirectory`: _string_ ; `yes?`: _boolean_ }

Defined in: [types.ts:8](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/types.ts#L8)

---

### ReleaseOptions

Ƭ **ReleaseOptions**: _object_

#### Type declaration:

| Name                    | Type                                              |
| :---------------------- | :------------------------------------------------ |
| `availableEnvironments` | _number_                                          |
| `ignoreMigrationCheck?` | _boolean_                                         |
| `options`               | [_MigrationOptions_](modules.md#migrationoptions) |
| `releasePrefix`         | _string_                                          |

Defined in: [createReleaseEnvironment.ts:16](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/createReleaseEnvironment.ts#L16)

## Functions

### copyWorkflow

▸ **copyWorkflow**(`__namedParameters`: [_CopyWorkflowOptions_](modules.md#copyworkflowoptions)): _Promise_<void\>

#### Parameters:

| Name                | Type                                                    |
| :------------------ | :------------------------------------------------------ |
| `__namedParameters` | [_CopyWorkflowOptions_](modules.md#copyworkflowoptions) |

**Returns:** _Promise_<void\>

Defined in: [copyWorkflow.ts:11](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/copyWorkflow.ts#L11)

---

### createReleaseEnvironment

▸ **createReleaseEnvironment**(`__namedParameters`: [_ReleaseOptions_](modules.md#releaseoptions)): _Promise_<undefined \| string\>

#### Parameters:

| Name                | Type                                          |
| :------------------ | :-------------------------------------------- |
| `__namedParameters` | [_ReleaseOptions_](modules.md#releaseoptions) |

**Returns:** _Promise_<undefined \| string\>

Defined in: [createReleaseEnvironment.ts:23](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/createReleaseEnvironment.ts#L23)

---

### deployMigrations

▸ **deployMigrations**(`__namedParameters`: [_DeployOptions_](modules.md#deployoptions)): _Promise_<PendingMigration[]\>

#### Parameters:

| Name                | Type                                        |
| :------------------ | :------------------------------------------ |
| `__namedParameters` | [_DeployOptions_](modules.md#deployoptions) |

**Returns:** _Promise_<PendingMigration[]\>

Defined in: [deploy.ts:21](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/deploy.ts#L21)

---

### initEnvironment

▸ **initEnvironment**(`options`: [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions)): _Promise_<void\>

#### Parameters:

| Name      | Type                                                              |
| :-------- | :---------------------------------------------------------------- |
| `options` | [_ContentfulPartialOptions_](modules.md#contentfulpartialoptions) |

**Returns:** _Promise_<void\>

Defined in: [initEnvironment.ts:7](https://github.com/foobaragency/cf-migrations/blob/14c0f58/lib/initEnvironment.ts#L7)
