
declare module 'path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function dirname(p: string): string;
  export function basename(p: string, ext?: string): string;
  export function extname(p: string): string;
  export function normalize(p: string): string;
  export function isAbsolute(p: string): boolean;
  
  export interface ParsedPath {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  }
  export function parse(pathString: string): ParsedPath;
  export function format(pathObject: ParsedPath): string;
  
  export const sep: string;
  export const delimiter: string;
  export const win32: any;
  export const posix: any;
}

declare var __dirname: string;
declare var __filename: string;
declare var process: {
  env: Record<string, string | undefined>;
  cwd: () => string;
};
