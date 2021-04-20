# cf-migrations

`cf-migrations` is tool for deploying and managing Contentful migrations.

## Installation

Pre-requisites

- Node LTS

```bash
npm install cf-migrations
```

## Usage

### CLI

The CLI documentation can be found [here](docs/CLI.md).

### API

The API documentation can be found [here](docs/generated/API.md).

### Typescript migration files

You can use typescript to write the migrations but you'll need to use ts-node like [contentful-migration](https://github.com/contentful/contentful-migration/blob/master/README.md#writing-migrations-in-typescript) or have a compiling tooling for your migrations.

If you compile your migrations you could do the following. Suppose you have the following project:

```
./
├── my_project/
│   ├── tsconfig.json
│   ├── src/
│       ├── migrations/
│           ├── 0001-create-contenty-type.ts
│           ├── 0002-add-field.ts
            ...
│   ├── dist/
│       ├── migrations/
│           ├── 0001-create-contenty-type.js
│           ├── 0002-add-field.js
            ...
...
```

You could deploy the migrations with the following command:

```bash
npx cf-migrations deploy --migrationsPath dist/migrations
```

An alternative is to run the deployment with ts-node, therefore no need to compile the migrations:

```bash
npx ts-node node_modules/cf-migrations/.bin/cf-migrations deploy --migrationsPath src/migrations
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Take a look into the [development guidelines](docs/Development.md).

## License

[MIT](https://choosealicense.com/licenses/mit/)
