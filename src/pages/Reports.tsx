import React from 'react';
import ComingSoon from '../components/ComingSoon';

export default function Reports() {
  return (
    <ComingSoon
      title="Rapports et Analyses"
      description="Cette fonctionnalité est en cours de développement. Bientôt, vous pourrez analyser vos transcriptions en profondeur et générer des rapports détaillés."
      features={[
        "Analyse des sujets principaux abordés dans vos transcriptions",
        "Statistiques sur la durée et la fréquence de vos enregistrements",
        "Génération de résumés automatiques",
        "Export de rapports au format PDF",
        "Tableaux de bord personnalisables",
        "Identification des tendances et des mots-clés"
      ]}
    />
  );
}
