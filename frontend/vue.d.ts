declare module '*.vue'

interface ImportMetaEnv {
  readonly APP_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

