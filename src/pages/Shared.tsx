import React from 'react';
import ComingSoon from '../components/ComingSoon';

export default function Shared() {
  return (
    <ComingSoon
      title="Transcriptions Partagées"
      description="La fonctionnalité de partage collaboratif arrive bientôt ! Vous pourrez partager vos transcriptions et collaborer en temps réel avec votre équipe."
      features={[
        "Partage sécurisé avec contrôle d'accès",
        "Édition collaborative en temps réel",
        "Commentaires et annotations",
        "Historique des modifications",
        "Gestion des permissions par utilisateur",
        "Intégration avec les outils de travail d'équipe"
      ]}
    />
  );
}
