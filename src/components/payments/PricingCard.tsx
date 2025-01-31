import React from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PricingFeature[];
  priceId: string;
  popular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  onSelectPlan: (planId: string, priceId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan }) => {
  const { user } = useAuth();

  return (
    <div
      className={`relative p-8 bg-white rounded-2xl shadow-lg border ${
        plan.popular ? 'border-primary' : 'border-gray-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
            Le plus populaire
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-4 flex items-baseline justify-center gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-gray-900">
            {plan.price}€
          </span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
            /{plan.interval}
          </span>
        </div>

        <button
          onClick={() => onSelectPlan(plan.id, plan.priceId)}
          className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${
            plan.popular
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          } transition-colors`}
        >
          {user ? "Choisir ce plan" : "Commencer l'essai gratuit"}
        </button>
      </div>

      <ul className="mt-8 space-y-4">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div
              className={`flex-shrink-0 ${
                feature.included ? 'text-primary' : 'text-gray-300'
              }`}
            >
              <Check className="h-6 w-6" />
            </div>
            <span className="ml-3 text-sm text-gray-600">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PricingCard;
