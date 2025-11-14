# 🍽️ Food Tracker - AI Nutrition Tracker

Application web moderne de suivi nutritionnel avec analyse d'images de repas par IA (Claude Vision).

## ✨ Fonctionnalités

- 📸 **Analyse de repas par photo** : Uploadez une photo, l'IA détecte les aliments et calcule les valeurs nutritionnelles
- 🔐 **Authentification** : Système de connexion/inscription avec NextAuth.js
- 📊 **Profil utilisateur** : Configurez votre profil (poids, taille, objectifs)
- 📈 **Dashboard** : Suivi quotidien de vos calories et macronutriments
- 🎨 **Design moderne** : Interface mobile-first avec palette orange/pêche

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou pnpm

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

Éditez le fichier `.env` :

```env
# Base de données (SQLite par défaut pour dev)
DATABASE_URL="file:./dev.db"

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

# Démarrer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🧪 POC - Analyse de repas

Un POC fonctionnel d'analyse d'images est disponible sur `/analyze`.

### Test automatisé

```bash
# Tester l'API avec une image de test
node test-analyze-api.mjs
```

### Test manuel

1. Aller sur http://localhost:3000/analyze
2. Uploader une photo de repas
3. Cliquer sur "Analyser le repas"
4. Voir les résultats nutritionnels !

**Exemple de résultat :**
- Détection de 5 aliments (pâtes, lardons, sauce, fromage, épices)
- Calcul : 726 kcal, 29.7g protéines, 55.3g glucides, 42.1g lipides
- Confiance : 80%

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** : Documentation technique complète pour développeurs
- **[POC_ANALYZE_MEAL.md](./POC_ANALYZE_MEAL.md)** : Guide du POC d'analyse de repas
- **[NOUVEAU_DESIGN.md](./NOUVEAU_DESIGN.md)** : Documentation du design system

## 🛠️ Stack technique

### Frontend
- **Next.js 15.5.6** (App Router, React Server Components)
- **React 19.1.0**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (composants)

### Backend
- **Next.js API Routes**
- **Anthropic Claude API** (Sonnet 4.5 Vision)
- **Prisma ORM** + SQLite (dev) / PostgreSQL (prod)
- **NextAuth.js** (authentification)

## 📂 Structure du projet

```
app/
├── (auth)/              # Pages d'authentification
├── dashboard/           # Dashboard principal
├── profile/             # Configuration profil
├── analyze/             # Analyse de repas (POC)
└── api/
    ├── auth/            # NextAuth endpoints
    ├── analyze-meal/    # ✨ Analyse d'image Claude Vision
    └── user/            # Gestion utilisateur

components/
├── ui/                  # shadcn/ui components
├── analyze/             # Composants d'analyse
└── dashboard/           # Composants dashboard

lib/
├── nutrition/           # Calculs nutritionnels (BMR, TDEE, etc.)
└── prisma.ts           # Client Prisma
```

## 🗄️ Base de données

### Development (SQLite)

```bash
# Générer le client
npx prisma generate

# Ouvrir Prisma Studio
npm run studio
```

### Production (PostgreSQL Cloud)

Voir [PRISMA_CLOUD_SETUP.md](./PRISMA_CLOUD_SETUP.md) pour configurer Prisma Postgres ou Neon.

## 🧪 Scripts utiles

```bash
# Développement
npm run dev              # Serveur dev avec Turbopack

# Base de données
npx prisma generate      # Générer client Prisma
npx prisma db push       # Appliquer le schéma
npm run studio           # Interface DB (port 5555)

# Build
npm run build            # Build de production
npm start                # Serveur de production

# Qualité
npm run lint             # ESLint
npx tsc --noEmit         # Vérification TypeScript

# Test
node test-analyze-api.mjs  # Test API d'analyse
```

## 🔑 Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de données | ✅ |
| `NEXTAUTH_URL` | URL de l'application | ✅ |
| `NEXTAUTH_SECRET` | Secret NextAuth (32+ caractères) | ✅ |
| `ANTHROPIC_API_KEY` | Clé API Anthropic | ✅ (pour analyse) |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob | ❌ (futur) |

## 🚧 Roadmap

- [x] Authentification utilisateur
- [x] Profil et onboarding
- [x] Dashboard de base
- [x] **POC Analyse d'images avec Claude Vision**
- [ ] **Setup Prisma Cloud Database** (en cours)
- [ ] Sauvegarde des repas en DB
- [ ] Stockage d'images (Vercel Blob)
- [ ] Historique des repas
- [ ] Graphiques de progression
- [ ] Recommandations personnalisées
- [ ] Export de données

## 🤝 Contribution

Ce projet est en développement actif. Consultez [CLAUDE.md](./CLAUDE.md) pour les conventions de code et le workflow de développement.

## 📄 Licence

[MIT License](./LICENSE)

## 🔗 Liens utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Made with ❤️ and 🤖 Claude Code**
