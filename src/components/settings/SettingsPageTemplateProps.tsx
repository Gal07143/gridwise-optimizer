
import React from 'react';

export interface SettingsPageTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

// This file just exports the type for easy importing
