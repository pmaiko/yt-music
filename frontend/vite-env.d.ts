interface ImportMetaEnv {
  readonly VITE_SERVER_PORT: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}