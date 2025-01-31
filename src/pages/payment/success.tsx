import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '../../components/Layout';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers le dashboard après 5 secondes
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Paiement réussi !
          </h1>
          
          <p className="mt-4 text-gray-600">
            Merci pour votre achat. Vous allez être redirigé vers votre tableau de bord dans quelques secondes...
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 w-full px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            Aller au tableau de bord
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
