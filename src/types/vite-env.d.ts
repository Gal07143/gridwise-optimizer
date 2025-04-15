
/// <reference types="vite/client" />

// Declare modules that don't have type declarations
declare module 'vite';
declare module '@vitejs/plugin-react-swc';
declare module 'lovable-tagger';

// Global variable declaration for Node.js
declare const __dirname: string;
declare const process: {
  env: {
    NODE_ENV: string;
    [key: string]: string | undefined;
  }
};

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // add other env variables here
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot: {
    accept: Function;
    dispose: Function;
    data: any;
  };
}
