import React from 'react';
import Layout from '../components/Layout';
import { Mic2, FileText, Wand2, Brain } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Mic2 className="h-6 w-6 text-primary" />,
      title: "Transcription Audio",
      description: "Convertissez vos fichiers audio en texte avec une précision exceptionnelle grâce à notre IA avancée."
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Prise de Notes Intelligente",
      description: "Générez automatiquement des résumés et des points clés de vos réunions."
    },
    {
      icon: <Wand2 className="h-6 w-6 text-primary" />,
      title: "Formatage Automatique",
      description: "Obtenez des transcriptions proprement formatées et organisées, prêtes à être utilisées."
    },
    {
      icon: <Brain className="h-6 w-6 text-primary" />,
      title: "IA Contextuelle",
      description: "Notre IA comprend le contexte et adapte la transcription en conséquence."
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Nos Fonctionnalités
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Découvrez comment Transcriptor peut transformer vos réunions en contenu actionnable.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature, index) => (
                <div key={index} className="group relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Prêt à transformer vos réunions ?
            </h3>
            <div className="mt-8">
              <a
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Commencer gratuitement
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;
