import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mic, History, Settings, LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
              <Mic className="h-6 w-6" />
              <span className="ml-2 font-medium">Transcription App</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/transcribe" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              Transcribe
            </Link>
            <Link to="/history" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <History className="h-5 w-5" />
            </Link>
            <Link to="/settings" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;