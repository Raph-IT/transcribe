import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';
import { 
  Mic, 
  Languages, 
  Brain, 
  Shield,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    name: 'Transcription en temps réel',
    description: 'Transcrivez vos réunions en direct avec une précision exceptionnelle grâce à notre IA avancée.',
    icon: Mic
  },
  {
    name: 'Multi-langues',
    description: 'Support de plus de 30 langues avec détection automatique et traduction instantanée.',
    icon: Languages
  },
  {
    name: 'Résumé automatique',
    description: 'Obtenez un résumé concis et pertinent de vos réunions généré par IA.',
    icon: Brain
  },
  {
    name: 'Sécurité maximale',
    description: 'Vos données sont chiffrées de bout en bout et stockées de manière sécurisée.',
    icon: Shield
  }
];

const platforms = [
  { 
    name: 'Google Meet',
    logo: '/logos/google-meet.png',
    link: 'https://meet.google.com'
  },
  { 
    name: 'Microsoft Teams',
    logo: '/logos/teams.png',
    link: 'https://teams.microsoft.com'
  },
  { 
    name: 'Zoom',
    logo: '/logos/zoom.png',
    link: 'https://zoom.us'
  }
];

const stats = [
  {
    title: "Utilisateurs actifs",
    value: "20K+",
  },
  {
    title: "Minutes transcrites",
    value: "500K+",
  },
  {
    title: "Langues supportées",
    value: "30+",
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <Layout withPadding={false} forceLandingLayout={true}>
      <div className="relative">
        {/* Background gradient */}
        <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 sm:pt-24 lg:pt-32">
            <div className="lg:w-2/3 text-center mx-auto">
              <h1 className="text-gray-900 font-bold text-5xl md:text-6xl xl:text-7xl">
                Transcrivez vos <span className="text-primary">réunions</span>
              </h1>
              <p className="mt-8 text-gray-700">
                Transformez automatiquement vos réunions en texte exploitable grâce à notre technologie de transcription IA avancée.
              </p>
              <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-white">
                      Accéder au dashboard
                    </span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                    >
                      <span className="relative text-base font-semibold text-white">
                        Commencer gratuitement
                      </span>
                    </Link>
                    <Link
                      to="/pricing"
                      className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                    >
                      <span className="relative text-base font-semibold text-primary">
                        Voir les tarifs
                      </span>
                    </Link>
                  </>
                )}
              </div>

              <div className="hidden py-8 mt-16 border-y border-gray-100 sm:flex justify-between">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700">{stat.value}</h6>
                    <p className="mt-2 text-gray-500">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms Section */}
            <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 grayscale transition duration-200 hover:grayscale-0"
                >
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="h-12 w-auto mx-auto"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>

            {/* Features Section */}
            <div className="mt-32">
              <div className="md:w-2/3 lg:w-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary">
                  <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
                </svg>
                
                <h2 className="my-8 text-2xl font-bold text-gray-700 md:text-4xl">
                  La transcription de réunions simplifiée
                </h2>
                <p className="text-gray-600">
                  Notre solution s'intègre parfaitement à votre flux de travail pour vous faire gagner du temps et de l'efficacité.
                </p>
              </div>
              <div className="mt-16 grid divide-x divide-y divide-gray-100 overflow-hidden rounded-3xl border border-gray-100 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
                {features.map((feature, index) => (
                  <div key={index} className="group relative bg-white transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                    <div className="relative space-y-8 py-12 p-8">
                      <feature.icon className="w-12 h-12 text-primary" />

                      <div className="space-y-2">
                        <h5 className="text-xl font-semibold text-gray-700 transition group-hover:text-secondary">
                          {feature.name}
                        </h5>
                        <p className="text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="relative mt-32 py-32">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Prêt à booster votre productivité ?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                  Commencez dès maintenant à transformer vos réunions en contenu actionnable.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    to="/register"
                    className="rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Commencer gratuitement
                  </Link>
                  <Link
                    to="/contact"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Nous contacter <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
