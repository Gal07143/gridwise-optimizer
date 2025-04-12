import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { mainRoute } from './routes/config';
import { RouteConfig } from './routes/types';

/**
 * Helper function to render a route configuration
 * @param config The route configuration to render
 * @returns React node with the rendered route
 */
const renderRoute = (config: RouteConfig): React.ReactNode => {
  if (config.children) {
    return (
      <Route key={config.path} path={config.path} element={config.element}>
        {config.children.map(renderRoute)}
      </Route>
    );
  }
  return <Route key={config.path} path={config.path} element={config.element} />;
};

/**
 * Main routing component that defines all application routes
 * Routes are organized by feature area for better maintainability
 * and include metadata for documentation and SEO
 */
const AppRoutes: React.FC = () => {
  return <Routes>{renderRoute(mainRoute)}</Routes>;
};

export default AppRoutes;
