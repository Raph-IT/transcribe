# Transcriptor

Une application web moderne pour transcrire, formater et résumer des fichiers audio en utilisant l'IA.

## Fonctionnalités

- 🎙 Transcription audio vers texte avec Whisper AI
- 📝 Formatage automatique des transcriptions
- 📊 Génération de résumés avec points clés
- 👥 Système d'authentification
- 📱 Interface responsive et moderne
- 🌍 Support multilingue

## Technologies utilisées

- Frontend : React + TypeScript + Vite
- Style : Tailwind CSS
- Base de données : Supabase
- IA : OpenAI (Whisper + GPT-3.5)
- Authentification : Supabase Auth

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd Transcriptor
```

2. Installez les dépendances :
```bash
npm install
```

3. Copiez le fichier .env.example en .env :
```bash
cp .env.example .env
```

4. Configurez vos variables d'environnement dans le fichier .env :
- VITE_SUPABASE_ANON_KEY : Votre clé anonyme Supabase
- VITE_SUPABASE_URL : L'URL de votre projet Supabase
- VITE_OPENAI_API_KEY : Votre clé API OpenAI

5. Initialisez la base de données Supabase :
- Créez un nouveau projet sur Supabase
- Exécutez le script SQL de migration dans l'éditeur SQL de Supabase (voir /supabase/migrations)

6. Lancez l'application en mode développement :
```bash
npm run dev
```

## Structure du projet

- `/src` : Code source de l'application
  - `/components` : Composants React réutilisables
  - `/pages` : Pages de l'application
  - `/lib` : Utilitaires et configuration
  - `/context` : Contextes React (auth, etc.)
- `/supabase` : Configuration et migrations Supabase

## Contribution

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## License

MIT
