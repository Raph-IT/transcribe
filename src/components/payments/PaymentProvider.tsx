import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';

interface PaymentProviderProps {
  stripe: Promise<Stripe | null>;
  options: {
    clientSecret: string;
    appearance?: {
      theme: 'stripe' | 'night' | 'flat';
      variables?: {
        colorPrimary?: string;
        colorBackground?: string;
        colorText?: string;
        colorDanger?: string;
        fontFamily?: string;
        spacingUnit?: string;
        borderRadius?: string;
      };
    };
  };
  children: React.ReactNode;
}

const PaymentProvider: React.FC<PaymentProviderProps> = ({
  stripe,
  options,
  children,
}) => {
  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
};

export default PaymentProvider;
