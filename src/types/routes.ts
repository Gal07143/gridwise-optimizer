import { ReactNode } from 'react';

export interface RouteMetadata {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  metadata?: RouteMetadata;
} 