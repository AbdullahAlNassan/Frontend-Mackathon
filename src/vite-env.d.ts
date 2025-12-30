/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAFANA_IFRAME_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


