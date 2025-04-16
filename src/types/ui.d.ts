
import React, { ReactNode, Ref } from 'react';

// Button component props
export interface ButtonProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info' | 'danger';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'full';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingText?: string;
  asChild?: boolean;
}

// Card component props
export interface CardProps {
  className?: string;
  children?: ReactNode;
  key?: string | number;
  variant?: 'default' | 'ghost' | 'outline' | 'elevated';
  interactive?: boolean;
}

export interface CardHeaderProps {
  className?: string;
  children?: ReactNode;
}

export interface CardTitleProps {
  className?: string;
  children?: ReactNode;
}

export interface CardDescriptionProps {
  className?: string;
  children?: ReactNode;
}

export interface CardContentProps {
  className?: string;
  children?: ReactNode;
}

export interface CardFooterProps {
  className?: string;
  children?: ReactNode;
}

// Alert component props
export interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children?: ReactNode;
}

export interface AlertTitleProps {
  className?: string;
  children?: ReactNode;
}

export interface AlertDescriptionProps {
  className?: string;
  children?: ReactNode;
}

// Badge component props
export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'danger';
  className?: string;
  children?: ReactNode;
}

// Tabs components props
export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

export interface TabsListProps {
  className?: string;
  children?: ReactNode;
}

export interface TabsTriggerProps {
  value: string;
  className?: string;
  children?: ReactNode;
}

export interface TabsContentProps {
  value: string;
  className?: string;
  children?: ReactNode;
}

// Label component props
export interface LabelProps {
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
  variant?: 'default' | 'muted' | 'error' | 'success';
  size?: 'default' | 'sm' | 'lg';
  required?: boolean;
  helperText?: string;
}

// Select component props
export interface SelectProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
}

export interface SelectTriggerProps {
  className?: string;
  children?: ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

export interface SelectContentProps {
  className?: string;
  position?: 'popper' | 'item-aligned';
  children?: ReactNode;
}

export interface SelectItemProps {
  value: string;
  className?: string;
  children?: ReactNode;
  key?: string;
}

export interface DeviceParameterProps {
  name: string;
  value: string;
  unit?: string;
  key?: string; 
}

// Progress component props
export interface ProgressProps {
  value?: number;
  className?: string;
  max?: number;
  children?: ReactNode;
}
