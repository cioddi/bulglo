import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showProgress?: boolean;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  showProgress = true,
  showNavigation = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title={title} showProgress={showProgress} />
      
      <main className="flex-1">
        {children}
      </main>
      
      {showNavigation && <Navigation />}
    </div>
  );
};