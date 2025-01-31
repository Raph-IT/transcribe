import React from 'react';
import Layout from '../components/Layout';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      description: 'Parfait pour commencer',
      features: [
        '30 minutes de transcription par mois',
        'Transcription basique',
        'Export en texte brut',
        'Support par email'
      ]
    },
    {
      name: 'Pro',
      price: '19€',
      description: 'Pour les professionnels',
      features: [
        '5 heures de transcription par mois',
        'Transcription avancée avec IA',
        'Export en multiple formats',
        'Support prioritaire',
        'Détection des interlocuteurs',
        'Résumé automatique'
      ]
    },
    {
      name: 'Entreprise',
      price: 'Sur mesure',
      description: 'Pour les grandes équipes',
      features: [
        'Transcription illimitée',
        'API dédiée',
        'Intégration personnalisée',
        'Support dédié 24/7',
        'Formation sur mesure',
        'SLA garanti'
      ]
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Tarifs simples et transparents
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.price !== 'Sur mesure' && <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mois</span>}
                </p>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-primary" />
                      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href={plan.name === 'Entreprise' ? '/contact' : '/register'}
                    className="block w-full rounded-full py-3 px-6 text-center text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {plan.name === 'Entreprise' ? 'Contactez-nous' : 'Commencer'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Des questions ?
            </h3>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Notre équipe est là pour vous aider à choisir le meilleur plan pour vos besoins.
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
