# cf-migrations

`cf-migrations` is a tool for deploying and managing migrations and environment aliases in Contentful.

## ⚙️ Installation

Pre-requisites:

- Node LTS

```bash
npm install --save cf-migrations
```

## 🔌 Usage

### 🔐 Contentful credentials

Almost all the `cf-migrations` commands require contentful credentials besides specific arguments per command. You can pass those arguments as **command line arguments** or **environment variables**.

You can use the `-h` or `--help` in any command to show its usage help. For example, run `npx cf-migrations init -h` to see the required and optional arguments of the `init` command.

> 💡 `cf-migrations` uses [dotenv](https://github.com/motdotla/dotenv) to read a `.env` file so you write your credentials only once when using `cf-migrations` in your project locally.

### 🥾 Init environment

In order for you to use `cf-migrations` deploy or release commands, you should run the following:

```bash
npx cf-migrations init
```

It creates a new content model named cf-migrations that will store every deployed migration file name. `cf-migrations` uses these names to assess if there're pending migrations yet to be deployed.

### 🏗 Create migration

After initializing your contentful environment, it's time to write some migrations! To create a new migration file in your project, type the following:

```bash
npx cf-migrations create create-foo --migrationsDir src/migrations
```

It will create a typescript migration file, `src/migrations/0001-create-foo.ts` for example. Use the flag `--useJavascript` or `--js` to create a javascript file instead.

Note that the migrations should have a proper sequence number.

### 🚚 Deploy migration

After writing your migration, you can deploy a single or every pending migration with the following command:

```bash
npx cf-migrations deploy
```

> 📢 Note that the "deploy" and "release" commands only support javascript files. See the typescript section for more details about how you could work with typescript migrations.

After the deployment, the pending migrations changes will be applied and their file names will be added to the `cf-migrations` content type.

### 🚀 Release new environment version

The release functionality works by assessing if there are pending migrations to be deployed (this verification can be skipped), creating a new environment, deploying pending migrations on it and update the target environment alias to the new environment.

```bash
npx cf-migrations release
```

Since the number of available environments is limited, the oldest release that is not aliased will be removed.

> 📢 Since contentful does not have a functionality yet to also copy the scheduled actions if you create a new environment from an existing one,
> we have created a feature as a workaround to do the job.
> The feature is by default activated and can be deactivated by setting the parameter `copy-scheduled-actions` to `false`.

## 📚 API

Using `cf-migrations`' CLI isn't the only option: you can integrate its functionalities with your project by using the library's API.

The API documentation can be found [here](docs/generated/modules.md).

## 🎖 Typescript support

You can use typescript to write the migrations but you'll need to use tools such as [ts-node](https://github.com/TypeStrong/ts-node) or have compiling tooling for your migrations.

Suppose you have the following project where there is a typescript compilation tooling:

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
npx cf-migrations deploy --migrationsDir dist/migrations
```

An alternative is to run the deployment with ts-node, therefore no need to compile the migrations:

```bash
npx ts-node node_modules/.bin/cf-migrations deploy --migrationsDir src/migrations
```

## 👥 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## 🏛 License

[MIT](https://choosealicense.com/licenses/mit/)
