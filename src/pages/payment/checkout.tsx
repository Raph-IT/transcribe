import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PaymentProvider from '../../components/payments/PaymentProvider';
import CheckoutForm from '../../components/payments/CheckoutForm';
import stripePromise from '../../lib/stripe';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const { priceId, planId } = router.query;

  useEffect(() => {
    if (!priceId || !user) return;

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            customerId: user.customerId, // Si vous stockez l'ID client Stripe
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };

    createPaymentIntent();
  }, [priceId, user]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6366f1',
        borderRadius: '0.5rem',
      },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Finaliser votre achat
            </h1>
            
            <PaymentProvider stripe={stripePromise} options={options}>
              <CheckoutForm 
                planId={planId as string} 
                priceId={priceId as string} 
              />
            </PaymentProvider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
