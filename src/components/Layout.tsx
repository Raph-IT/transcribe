import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  withPadding?: boolean;
  forceLandingLayout?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, withPadding = true, forceLandingLayout = false }) => {
  const { user } = useAuth();

  if (user && !forceLandingLayout) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className={`${withPadding ? 'p-8' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Navbar />
      <main className={`flex-1 ${withPadding ? 'pt-16' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
