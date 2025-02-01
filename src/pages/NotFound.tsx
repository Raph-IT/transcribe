import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
            <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-900 dark:text-white">
              Oups !
            </p>
          </div>
          
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Cette page semble avoir disparu dans le néant...
          </p>
          
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Accueil
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
