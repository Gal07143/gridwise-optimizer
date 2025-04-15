
declare module 'react' {
  // React types
  export type ReactNode = string | number | boolean | React.ReactElement | React.ReactFragment | React.ReactPortal | null | undefined;
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
  export type ComponentType<P = {}> = FC<P> | ClassType<P, any, any>;

  // Basic hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: Context<T>): T;
  export function useReducer<R extends Reducer<any, any>, I>(
    reducer: R,
    initializerArg: I & ReducerState<R>,
    initializer: (arg: I & ReducerState<R>) => ReducerState<R>
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  export function useReducer<R extends Reducer<any, any>>(
    reducer: R,
    initializerArg: ReducerState<R>,
    initializer?: undefined
  ): [ReducerState<R>, Dispatch<ReducerAction<R>>];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  export function useRef<T = undefined>(initialValue: T): MutableRefObject<T>;

  // Component types
  export class Component<P = {}, S = {}, SS = any> {
    constructor(props: P, context?: any);
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: React.ReactInstance
    };
  }

  export interface ErrorInfo {
    componentStack: string;
  }

  // Context API
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string | undefined;
  }
  export function createContext<T>(defaultValue: T): Context<T>;

  // Types for internal use
  export type Reducer<S, A> = (prevState: S, action: A) => S;
  export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export type Dispatch<A> = (value: A) => void;
  export interface MutableRefObject<T> {
    current: T;
  }
  export interface Provider<T> {
    (props: { value: T; children: ReactNode }): React.ReactElement | null;
  }
  export interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): React.ReactElement | null;
  }
  export type ClassType<P, T, C> = new (props: P, context?: C) => T;
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  export type Key = string | number;
  export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
  export type ReactFragment = {} | Iterable<ReactNode>;
  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  export type React$Element<T> = ReactElement<T>;
}
