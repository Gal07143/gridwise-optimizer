
declare module 'react' {
  // React types
  export type Key = string | number;
  export type ReactNode = string | number | boolean | ReactElement | ReactFragment | ReactPortal | null | undefined;
  export interface FC<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }
  export interface FunctionComponent<P = {}> {
    (props: P): ReactElement | null;
    displayName?: string;
  }
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
  export type ComponentType<P = {}> = FC<P> | ClassType<P, any, any>;
  export type ElementType<P = any> = {
    [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
  }[keyof JSX.IntrinsicElements] | ComponentType<P>;
  
  // Form event types
  export interface FormEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }
  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget & T;
    timeStamp: number;
    type: string;
  }

  // Define Element and ReactElement properly
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
  
  export namespace JSX {
    interface Element extends ReactElement {}
  }

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
    readonly props: Readonly<P> & Readonly<{ children?: ReactNode }>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: ReactInstance
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
    (props: { value: T; children: ReactNode }): ReactElement | null;
  }
  export interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement | null;
  }
  export type ClassType<P, T, C> = new (props: P, context?: C) => T;
  export type ReactFragment = Iterable<ReactNode>;
  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }
  export type ReactInstance = Component<any> | Element;
}
