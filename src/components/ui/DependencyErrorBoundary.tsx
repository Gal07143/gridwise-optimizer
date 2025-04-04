
import React, { Component, ErrorInfo, ReactNode } from 'react';
import SmartDependencyErrorBoundary from './SmartDependencyErrorBoundary';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

class DependencyErrorBoundary extends Component<Props> {
  render(): ReactNode {
    // We now use our enhanced SmartDependencyErrorBoundary
    return (
      <SmartDependencyErrorBoundary fallback={this.props.fallback}>
        {this.props.children}
      </SmartDependencyErrorBoundary>
    );
  }
}

export default DependencyErrorBoundary;
