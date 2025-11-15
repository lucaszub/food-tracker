# 🍽️ Food Tracker - AI Nutrition Tracker

Application web moderne de suivi nutritionnel avec analyse d'images de repas par IA (Claude Vision).

## ✨ Fonctionnalités

- 📸 **Analyse de repas par photo** : Uploadez une photo, l'IA détecte les aliments et calcule les valeurs nutritionnelles
- 🔐 **Authentification complète** : Système de connexion/inscription avec NextAuth.js
- 👤 **Onboarding intelligent** : Configuration du profil (poids, taille, objectifs de poids)
- 📊 **Dashboard** : Suivi quotidien de vos calories et macronutriments
- 🎯 **Objectifs adaptatifs** : Calculs personnalisés (BMI, BMR, TDEE, macros)
- 🎨 **Design moderne** : Interface mobile-first avec palette orange/pêche
- ☁️ **Base de données cloud** : Prisma Postgres pour une disponibilité 24/7

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou pnpm
- Compte [Prisma Data Platform](https://console.prisma.io/) (gratuit)
- Clé API [Anthropic](https://console.anthropic.com/)

### Installation

```bash
# Cloner le repo
git clone <votre-repo>
cd food-tracker

# Installer les dépendances
npm install

# Copier le fichier .env
cp .env.example .env
```

### Configuration

#### 1. Base de données Prisma Postgres

Voir la documentation complète : [`docs/PRISMA_CLOUD_SETUP.md`](./docs/PRISMA_CLOUD_SETUP.md)

**Quick start :**
1. Créer un compte sur https://console.prisma.io/
2. Créer une database "food-tracker-db"
3. Copier la connection string

#### 2. Variables d'environnement

Éditez le fichier `.env` :

```env
# Base de données Prisma Postgres
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJ..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générer-avec-openssl-rand-base64-32"

# Anthropic API (pour l'analyse de repas)
ANTHROPIC_API_KEY="sk-ant-votre-cle-ici"
```

**Obtenir une clé Anthropic :**
1. Créer un compte sur https://console.anthropic.com/
2. Générer une clé API
3. La coller dans `.env`

### Lancer l'application

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers la DB cloud
npx prisma db push

# Démarrer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🧭 Guide d'utilisation

### Premier lancement

1. **Landing page** : Page d'accueil publique avec présentation
2. **Inscription** : Créer un compte avec email/mot de passe
3. **Onboarding** : Configurer votre profil (4 étapes)
   - Informations de base (nom, date de naissance, sexe)
   - Mesures corporelles (poids, taille)
   - Activité & Objectifs (niveau d'activité, poids cible)
   - Préférences alimentaires (allergies, régime)
4. **Dashboard** : Accès à votre espace personnel

### Analyser un repas

1. Aller sur la page **Analyze** (ou `/analyze`)
2. Prendre ou uploader une photo de votre repas
3. Sélectionner le type de repas (petit-déj, déjeuner, dîner, collation)
4. Cliquer sur "Analyser le repas"
5. Voir les résultats : aliments détectés + valeurs nutritionnelles

**Exemple de résultat :**
- Détection de 5 aliments avec portions estimées
- Calcul automatique : calories, protéines, glucides, lipides
- Score de confiance de l'analyse

## 📚 Documentation

Documentation technique et guides dans le dossier [`docs/`](./docs/) :

- **[docs/PRISMA_CLOUD_SETUP.md](./docs/PRISMA_CLOUD_SETUP.md)** : Configuration de la base de données cloud
- **[docs/POC_ANALYZE_MEAL.md](./docs/POC_ANALYZE_MEAL.md)** : POC d'analyse de repas avec Claude Vision
- **[docs/NOUVEAU_DESIGN.md](./docs/NOUVEAU_DESIGN.md)** : Documentation du design system
- **[docs/GUIDE_TEST.md](./docs/GUIDE_TEST.md)** : Guide de test des fonctionnalités
- **[CLAUDE.md](./CLAUDE.md)** : Documentation complète pour développeurs (architecture, conventions, etc.)

## 🛠️ Stack technique

### Frontend
- **Next.js 15.5.6** (App Router, React Server Components)
- **React 19.1.0**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** (composants UI)
- **Lucide React** (icônes)

### Backend
- **Next.js API Routes**
- **Anthropic Claude API** (Sonnet 4.5 Vision)
- **Prisma ORM** + **PostgreSQL** (Prisma Postgres cloud)
- **NextAuth.js** (authentification avec CredentialsProvider)
- **bcryptjs** (hashing de mots de passe)

### Base de données
- **Prisma Postgres** (PostgreSQL cloud managé)
- Connection pooling natif
- Zero cold starts
- Free tier : 100k opérations/mois

## 📂 Structure du projet

```
app/
├── (auth)/              # Pages d'authentification
│   ├── signin/
│   └── register/
├── dashboard/           # Dashboard principal
├── profile/             # Configuration profil
├── onboarding/          # Onboarding multi-étapes
├── analyze/             # Analyse de repas avec IA
└── api/
    ├── auth/            # NextAuth endpoints
    ├── analyze-meal/    # ✨ Analyse d'image Claude Vision
    ├── onboarding/      # Sauvegarde profil
    └── user/            # Gestion utilisateur

components/
├── ui/                  # shadcn/ui components
├── analyze/             # Composants d'analyse (ImageUploader, AnalysisResult)
├── dashboard/           # Composants dashboard
├── onboarding/          # Composants onboarding (WeightGoalSlider)
└── nutrition/           # Composants nutritionnels

lib/
├── nutrition/           # Calculs nutritionnels
│   ├── bmr.ts          # Métabolisme de base
│   ├── tdee.ts         # Dépense énergétique
│   ├── body-metrics.ts # IMC, masse grasse, poids idéal
│   └── macros.ts       # Répartition macronutriments
├── validations/         # Schémas Zod
├── auth.ts             # Configuration NextAuth
└── prisma.ts           # Client Prisma

prisma/
└── schema.prisma       # Schéma de base de données
```

## 🗄️ Base de données

### Schéma Prisma

Tables principales :
- `User` : Utilisateurs + métriques calculées + onboarding status
- `Account`, `Session` : NextAuth.js
- `Meal` : Repas analysés
- `FoodItem` : Aliments détectés dans les repas
- `UserPreferences` : Préférences alimentaires
- `WeightHistory` : Historique de poids

### Commandes utiles

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer le schéma à la DB
npx prisma db push

# Ouvrir Prisma Studio (interface graphique)
npm run studio  # http://localhost:5555

# Créer une migration
npx prisma migrate dev --name description

# Vérifier le schéma
npx prisma validate
```

## 🧪 Scripts disponibles

```bash
# Développement
npm run dev              # Serveur dev avec Turbopack

# Base de données
npx prisma generate      # Générer client Prisma
npx prisma db push       # Appliquer le schéma
npm run studio           # Prisma Studio (port 5555)

# Build
npm run build            # Build de production
npm start                # Serveur de production

# Qualité
npm run lint             # ESLint
npx tsc --noEmit         # Vérification TypeScript
```

## 🔑 Variables d'environnement

| Variable | Description | Requis | Exemple |
|----------|-------------|---------|---------|
| `DATABASE_URL` | Connection string Prisma Postgres | ✅ | `prisma+postgres://...` |
| `NEXTAUTH_URL` | URL de l'application | ✅ | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret NextAuth (32+ caractères) | ✅ | Générer avec `openssl rand -base64 32` |
| `ANTHROPIC_API_KEY` | Clé API Anthropic | ✅ | `sk-ant-...` |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob | ❌ | Pour stockage d'images (futur) |

## 🚧 Roadmap

### ✅ Complété
- [x] Authentification utilisateur (NextAuth.js)
- [x] Landing page publique moderne
- [x] Onboarding multi-étapes avec objectifs de poids
- [x] Profil utilisateur avec calculs nutritionnels (BMI, BMR, TDEE)
- [x] Dashboard de base avec progression quotidienne
- [x] **Analyse d'images avec Claude Vision API**
- [x] **Setup Prisma Postgres Cloud Database**
- [x] Protection des routes et gestion de session

### 🔄 En cours
- [ ] Sauvegarde des repas en base de données
- [ ] Stockage d'images avec Vercel Blob
- [ ] Historique des repas avec filtres

### 📋 À venir
- [ ] Graphiques de progression (charts.js ou recharts)
- [ ] Recommandations personnalisées via Claude
- [ ] Export de données (PDF, CSV)
- [ ] Mode hors-ligne avec sync
- [ ] Notifications push

## 🤝 Contribution

Ce projet est en développement actif. Consultez [CLAUDE.md](./CLAUDE.md) pour :
- Architecture détaillée
- Conventions de code
- Workflow de développement
- Guide de contribution

## 📄 Licence

[MIT License](./LICENSE)

## 🔗 Liens utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Data Platform](https://console.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com)
- [NextAuth.js](https://next-auth.js.org)

---

**Made with ❤️ and 🤖 [Claude Code](https://claude.com/claude-code)**
