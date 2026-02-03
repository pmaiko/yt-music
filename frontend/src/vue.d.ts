declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

