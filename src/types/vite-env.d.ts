
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv & {
    readonly MODE: string;
    readonly BASE_URL: string;
    readonly PROD: boolean;
    readonly DEV: boolean;
    readonly [key: string]: any;
  };
}

// Vite plugin types
declare module 'vite' {
  export interface UserConfig {
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    server?: {
      host?: boolean | string;
      port?: number;
      hmr?: {
        timeout?: number;
        overlay?: boolean;
      };
    };
    define?: Record<string, any>;
    optimizeDeps?: {
      include?: string[];
      esbuildOptions?: {
        target?: string;
      };
    };
    build?: {
      sourcemap?: boolean;
      chunkSizeWarningLimit?: number;
      rollupOptions?: {
        output?: {
          manualChunks?: Record<string, string[]>;
        };
      };
    };
    preview?: {
      port?: number;
      host?: boolean;
      cors?: boolean;
    };
  }

  export function defineConfig(config: UserConfig | ((env: { mode: string }) => UserConfig)): UserConfig;
}

declare module '@vitejs/plugin-react-swc' {
  export default function(options?: any): any;
}

declare module 'lovable-tagger' {
  export function componentTagger(): any;
}
