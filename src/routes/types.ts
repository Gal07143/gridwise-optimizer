import React from 'react'

export interface RouteMetadata {
  title: string
  description: string
}

export interface RouteConfig {
  path: string
  element: React.ReactNode
  metadata?: RouteMetadata
  children?: RouteConfig[]
} 