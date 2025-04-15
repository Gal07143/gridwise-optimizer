
declare module 'react/jsx-runtime' {
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  
  export function jsx(
    type: any,
    props: any,
    key?: string | number | null
  ): JSX.Element;
  
  export function jsxs(
    type: any,
    props: any,
    key?: string | number | null
  ): JSX.Element;
}

declare module 'react/jsx-dev-runtime' {
  export * from 'react/jsx-runtime';
}
