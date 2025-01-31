import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center px-6 py-8 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Connexion
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
                  onChange={handleChangeEmail}
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handleChangePassword}
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

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:opacity-80"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:opacity-80"
            >
              Inscrivez-vous gratuitement
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}