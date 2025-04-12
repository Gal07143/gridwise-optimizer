import React from 'react'

export interface RouteMetadata {
  title: string
  description: string
}

export interface RouteConfig {
  path: string
  element: React.ReactNode
  children?: RouteConfig[]
  metadata?: {
    title: string
    description: string
  }
} 