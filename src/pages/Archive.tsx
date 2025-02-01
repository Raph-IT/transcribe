import React from 'react';
import ComingSoon from '../components/ComingSoon';

export default function Archive() {
  return (
    <ComingSoon
      title="Archives"
      description="Notre système d'archivage intelligent est en cours de développement. Il vous permettra bientôt d'organiser et de stocker vos transcriptions de manière efficace."
      features={[
        "Organisation hiérarchique des transcriptions",
        "Système de tags et de catégories avancé",
        "Recherche full-text dans les archives",
        "Compression intelligente des fichiers audio",
        "Restauration facile des archives",
        "Export groupé des transcriptions archivées"
      ]}
    />
  );
}
