import React from 'react';
import { Construction } from 'lucide-react';
import Layout from './Layout';

interface ComingSoonProps {
  title: string;
  description: string;
  features?: string[];
}

export default function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <Construction className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {description}
          </p>
          
          {features && features.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-left">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Fonctionnalités à venir :
              </h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary text-sm">✓</span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
