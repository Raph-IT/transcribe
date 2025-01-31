import React from 'react';
import Layout from '../components/Layout';
import { Bot, FileText, Mic, Video } from 'lucide-react';

const AITools = () => {
  const tools = [
    {
      name: 'Transcription Audio',
      description: 'Transcrivez vos fichiers audio en texte avec une haute précision',
      icon: Mic,
      comingSoon: false,
    },
    {
      name: 'Transcription Vidéo',
      description: 'Extrayez le texte de vos vidéos automatiquement',
      icon: Video,
      comingSoon: false,
    },
    {
      name: 'Résumé Automatique',
      description: 'Générez des résumés concis de vos transcriptions',
      icon: FileText,
      comingSoon: false,
    },
    {
      name: 'Assistant IA',
      description: 'Posez des questions sur vos transcriptions et obtenez des réponses pertinentes',
      icon: Bot,
      comingSoon: true,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Outils d'Intelligence Artificielle
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative"
            >
              {tool.comingSoon && (
                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  Bientôt disponible
                </span>
              )}
              <div className="flex items-center mb-4">
                <tool.icon className="w-8 h-8 text-primary mr-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tool.name}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AITools;
