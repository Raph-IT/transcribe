import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  planId: string;
  priceId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ planId, priceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message ?? 'Une erreur est survenue.');
      }
    } catch (e) {
      setErrorMessage('Une erreur est survenue lors du traitement du paiement.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-8">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full px-6 py-3 text-white bg-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Traitement en cours...
          </div>
        ) : (
          'Payer maintenant'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
