import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Mic,
  Settings,
  LogOut,
  Share2,
  Bot,
  Archive,
  BarChart,
  Star
} from 'lucide-react';

const Sidebar = () => {
  const { signOut } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Mes Transcriptions',
      icon: Mic,
      href: '/transcribe',
      isActive: location.pathname === '/transcribe'
    },
    {
      title: 'Partagé Avec Moi',
      icon: Share2,
      href: '/shared',
      isActive: location.pathname === '/shared'
    },
    {
      title: 'Outils IA',
      icon: Bot,
      href: '/ai-tools',
      isActive: location.pathname === '/ai-tools'
    },
    {
      title: 'Archive',
      icon: Archive,
      href: '/archive',
      isActive: location.pathname === '/archive'
    },
    {
      title: 'Rapports',
      icon: BarChart,
      href: '/reports',
      isActive: location.pathname === '/reports'
    }
  ];

  const bottomMenuItems = [
    {
      title: 'Paramètres',
      icon: Settings,
      href: '/settings',
      isActive: location.pathname === '/settings'
    }
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="p-4">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-purple-600 bg-clip-text text-transparent">
            Transcriptor
          </span>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                item.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Usage Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Transcriptions
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              0/10 ce mois
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }} />
          </div>
          <Link
            to="/pricing"
            className="mt-3 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-md hover:opacity-90"
          >
            <Star className="h-4 w-4 mr-2" />
            Mise à niveau
          </Link>
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                item.isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.title}
            </Link>
          );
        })}
        <button
          onClick={signOut}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
