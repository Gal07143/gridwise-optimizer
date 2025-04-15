
declare module 'react' {
  // Core types
  export type Key = string | number;
  export type ReactNode = 
    | React.ReactElement 
    | string 
    | number 
    | boolean 
    | null 
    | undefined 
    | Iterable<React.ReactNode>;
  
  // Component types
  export interface FC<P = {}> {
    (props: P): ReactElement<any, any> | null;
    displayName?: string;
  }
  
  export interface FunctionComponent<P = {}> {
    (props: P): ReactElement<any, any> | null;
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

  // Elements and React elements
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  export type JSXElementConstructor<P> = 
    | ((props: P) => ReactElement<any, any> | null) 
    | (new (props: P) => Component<P, any>);

  // Fix the Element/ReactNode type compatibility
  export type ReactPortal = ReactElement;
  
  // Add missing forwardRef declaration
  export function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & { ref?: React.Ref<T> }) => React.ReactElement | null;
  
  // Add missing Ref types
  export type Ref<T> = RefCallback<T> | RefObject<T> | null;
  export type RefCallback<T> = (instance: T | null) => void;
  export interface RefObject<T> {
    readonly current: T | null;
  }
  
  // Add missing ElementRef
  export type ElementRef<C extends React.ElementType> = 
    C extends React.ComponentClass<any> 
      ? InstanceType<C> 
      : C extends React.ForwardRefExoticComponent<infer P> 
        ? P extends { ref?: infer R } 
          ? R 
          : never 
        : never;
  
  // Add missing ComponentProps types
  export type ComponentPropsWithoutRef<T extends ElementType> = 
    T extends new (props: infer P) => any 
      ? P 
      : T extends (props: infer P) => any 
        ? P 
        : never;
  
  export type ComponentPropsWithRef<T extends ElementType> = 
    T extends React.ComponentClass<infer P> 
      ? P & { ref?: Ref<InstanceType<T>> } 
      : T extends React.ForwardRefExoticComponent<infer P> 
        ? P 
        : ComponentPropsWithoutRef<T>;
  
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
  
  // Add HTML attribute types
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | ReadonlyArray<string> | number;
  }

  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string;
    style?: CSSProperties;
    id?: string;
  }

  export interface DOMAttributes<T> {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
    onClick?: (event: MouseEvent<T>) => void;
    onKeyDown?: (event: KeyboardEvent<T>) => void;
  }

  export interface CSSProperties {
    [key: string]: string | number | undefined;
  }

  export interface AriaAttributes {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-hidden'?: boolean | 'false' | 'true';
  }
  
  // Types for internal use
  export type Reducer<S, A> = (prevState: S, action: A) => S;
  export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
  export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
  export type Dispatch<A> = (value: A) => void;
  export interface MutableRefObject<T> {
    current: T;
  }
  export interface Provider<T> {
    (props: { value: T; children: ReactNode }): ReactElement<any, any> | null;
  }
  export interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement<any, any> | null;
  }
  export type ClassType<P, T, C> = new (props: P, context?: C) => T;
  export type ReactInstance = Component<any> | Element;

  // Fragment support
  export const Fragment: unique symbol;
  export interface SVGProps<T> extends SVGAttributes<T> {}
  
  // Event types
  export interface MouseEvent<T = Element> extends SyntheticEvent<T> {}
  export interface KeyboardEvent<T = Element> extends SyntheticEvent<T> {
    altKey: boolean;
    ctrlKey: boolean;
    key: string;
    keyCode: number;
    metaKey: boolean;
    shiftKey: boolean;
  }
  
  export interface SVGAttributes<T> extends HTMLAttributes<T> {
    viewBox?: string;
    xmlns?: string;
  }
}
