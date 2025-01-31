import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      // Logique d'inscription à implémenter
      console.log('Register with:', { email, password });
      
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Créer un compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse email"
                  className="peer block w-full rounded-md border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-900 sm:text-sm sm:leading-6"
                />
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-2 -mt-1 bg-white dark:bg-gray-950 px-2 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-primary peer-focus:to-secondary peer-focus:text-transparent peer-focus:bg-clip-text"
                >
                  Adresse email
                </label>
              </div>
            </div>

            <div>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="peer block w-full rounded-md border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-900 sm:text-sm sm:leading-6"
                />
                <label
                  htmlFor="password"
                  className="absolute -top-2 left-2 -mt-1 bg-white dark:bg-gray-950 px-2 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-primary peer-focus:to-secondary peer-focus:text-transparent peer-focus:bg-clip-text"
                >
                  Mot de passe
                </label>
              </div>
            </div>

            <div>
              <div className="relative mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  className="peer block w-full rounded-md border-0 py-3 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-900 sm:text-sm sm:leading-6"
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute -top-2 left-2 -mt-1 bg-white dark:bg-gray-950 px-2 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-primary peer-focus:to-secondary peer-focus:text-transparent peer-focus:bg-clip-text"
                >
                  Confirmer le mot de passe
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Création du compte...' : 'Créer un compte'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Déjà membre ?{' '}
            <Link
              to="/login"
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:opacity-80"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;