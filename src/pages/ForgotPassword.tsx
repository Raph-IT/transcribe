import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Instructions envoyées par email');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-green-400/20 to-green-500/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">
              Vérifiez votre boîte mail
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Nous avons envoyé les instructions de réinitialisation de mot de passe à {email}
            </p>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hover:opacity-80"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour recevoir les instructions de réinitialisation
          </p>
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
                  className="peer block w-full rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-transparent focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                <label
                  htmlFor="email"
                  className="absolute -top-2 left-2 -mt-1 bg-white px-2 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:left-2 peer-focus:text-xs peer-focus:bg-gradient-to-r peer-focus:from-primary peer-focus:to-secondary peer-focus:text-transparent peer-focus:bg-clip-text"
                >
                  Adresse email
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-gradient-to-r from-primary to-secondary px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Envoi...' : 'Envoyer les instructions'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Vous vous souvenez de votre mot de passe ?{' '}
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
}
