/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>
  export default component
}

declare module 'lite-youtube-embed/src/lite-yt-embed.js'
declare module 'lite-youtube-embed/src/lite-yt-embed.css'

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly BASE_URL?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
