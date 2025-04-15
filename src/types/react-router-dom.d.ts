
declare module 'react-router-dom' {
  import { ComponentType, ReactNode, FC } from 'react';
  
  // Route components
  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    index?: boolean;
    children?: React.ReactNode;
    caseSensitive?: boolean;
  }
  
  export const Routes: FC<{ children?: React.ReactNode }>;
  export const Route: FC<RouteProps>;
  
  // Navigation components
  export interface LinkProps {
    to: string;
    replace?: boolean;
    state?: any;
    className?: string;
    key?: number | string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }
  
  export const Link: FC<LinkProps>;
  export const NavLink: FC<LinkProps & { active?: string, end?: boolean }>;
  export const Navigate: FC<{ to: string, replace?: boolean, state?: any }>;
  export const Outlet: FC<{ context?: unknown }>;
  
  // Hooks
  export function useNavigate(): (path: string, options?: { replace?: boolean, state?: any }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useLocation(): {
    pathname: string;
    search: string;
    hash: string;
    state: any;
    key: string;
  };
  
  // Router components
  export interface BrowserRouterProps {
    basename?: string;
    children?: React.ReactNode;
    window?: Window;
  }
  
  export const BrowserRouter: FC<BrowserRouterProps>;
  
  // Utility types
  export interface RouteObject {
    path?: string;
    index?: boolean;
    children?: RouteObject[];
    caseSensitive?: boolean;
    element?: React.ReactNode;
  }
}
