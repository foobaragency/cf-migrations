export type LocaleDependent = { [locale: string]: string }

export type MigrationEntry = {
  fileName: LocaleDependent
}
