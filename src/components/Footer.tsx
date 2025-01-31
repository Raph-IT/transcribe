import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-purple-600 bg-clip-text text-transparent">
              Transcriptor
            </span>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Transformez vos réunions en contenu actionnable grâce à notre solution de transcription alimentée par l'IA.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Liens rapides</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {new Date().getFullYear()} Transcriptor. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
