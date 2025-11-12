# Food Tracker - Application de Suivi Nutritionnel avec IA

## Vue d'ensemble du projet

Application web moderne permettant aux utilisateurs de photographier leurs repas pour obtenir une analyse nutritionnelle complète via l'IA Claude. L'application calcule automatiquement les calories, macronutriments (protéines, glucides, lipides), et fournit des recommandations personnalisées basées sur le profil utilisateur.

## Objectifs principaux

1. **Analyse d'images de repas**: Utiliser l'API Claude Vision pour identifier les aliments dans une photo et estimer les portions
2. **Calcul nutritionnel**: Déterminer calories, protéines, glucides, lipides pour chaque repas
3. **Profil utilisateur**: Collecter poids, taille, âge, sexe, niveau d'activité
4. **Métriques personnalisées**: Calculer BMI, masse grasse estimée, poids idéal
5. **Recommandations quotidiennes**: Suggérer l'apport calorique et macronutriments optimaux
6. **Suivi dans le temps**: Historique des repas et progression vers les objectifs

## Stack technique

### Frontend (existant)

- **Next.js 15.5.6** avec App Router et React Server Components
- **React 19.1.0**
- **TypeScript** avec configuration stricte
- **Tailwind CSS v4** avec système de design personnalisé
- **shadcn/ui** (style "new-york") pour les composants UI
- **Lucide React** pour les icônes

### Backend (configuré)

- **Next.js API Routes** pour les endpoints
- **Anthropic Claude API** pour l'analyse d'images (claude-3-5-sonnet ou claude-3-opus)
- **Base de données**: Supabase PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js avec Prisma Adapter
- **Stockage images**: Vercel Blob
- **Validation**: Zod pour validation côté client et serveur
- **Formulaires**: React Hook Form

### APIs externes

- **Anthropic API**: Vision pour analyse d'images, generation de texte pour conseils
- **USDA FoodData Central** (optionnel): Base de données nutritionnelles pour validation

## Architecture de l'application

### Structure des dossiers

```
app/
  ├── (auth)/              # Routes d'authentification
  │   ├── login/
  │   └── register/
  ├── dashboard/           # Page principale après connexion
  ├── profile/             # Configuration du profil utilisateur
  ├── analyze/             # Page d'analyse de repas
  ├── history/             # Historique des repas
  └── api/
      ├── auth/            # Endpoints d'authentification
      ├── analyze-meal/    # Analyse d'image via Claude
      ├── meals/           # CRUD des repas
      └── profile/         # Gestion du profil

components/
  ├── ui/                  # shadcn/ui components
  ├── meal/                # Composants liés aux repas
  │   ├── MealCard.tsx
  │   ├── NutritionChart.tsx
  │   └── ImageUploader.tsx
  ├── profile/             # Composants de profil
  │   ├── ProfileForm.tsx
  │   └── MetricsDisplay.tsx
  └── dashboard/
      ├── DailyProgress.tsx
      └── RecommendationCard.tsx

lib/
  ├── db/                  # Client et schéma de base de données
  ├── anthropic/           # Client API Anthropic
  ├── nutrition/           # Calculs nutritionnels
  │   ├── bmr.ts          # Calcul métabolisme de base
  │   ├── tdee.ts         # Dépense énergétique totale
  │   ├── macros.ts       # Répartition macronutriments
  │   └── body-metrics.ts # IMC, masse grasse, poids idéal
  └── utils.ts
```

## Fonctionnalités détaillées

### 1. Capture et analyse de repas

**User Flow**:

1. L'utilisateur clique sur "Analyser un repas"
2. Deux options: Prendre une photo (mobile) ou uploader une image
3. Prévisualisation de l'image avec possibilité de retake
4. Clic sur "Analyser" → Loading state avec animation
5. Résultats affichés: Liste des aliments détectés avec portions estimées
6. Tableau nutritionnel global du repas
7. Option d'ajuster manuellement les portions ou aliments
8. Sauvegarde dans l'historique

**Prompt pour Claude Vision** (dans `lib/anthropic/analyze-meal.ts`):

```typescript
// Exemple de structure du prompt
const prompt = `Analyse cette photo de repas et fournis une liste détaillée:

Pour chaque aliment visible:
1. Nom de l'aliment en français
2. Estimation de la portion (en grammes, ml, ou unités)
3. Calories estimées
4. Protéines (g)
5. Glucides (g)
6. Lipides (g)

Format de réponse strictement en JSON:
{
  "foods": [
    {
      "name": "Poulet grillé",
      "portion": "150g",
      "calories": 250,
      "protein": 35,
      "carbs": 0,
      "fat": 10
    }
  ],
  "total": {
    "calories": 750,
    "protein": 45,
    "carbs": 80,
    "fat": 25
  },
  "confidence": 0.85,
  "notes": "Estimation basée sur portions standard"
}`;
```

### 2. Profil utilisateur et métriques

**Données à collecter**:

- Informations de base: Nom, email, date de naissance, sexe
- Mesures corporelles: Poids (kg), taille (cm)
- Niveau d'activité: Sédentaire, Léger, Modéré, Intense, Très intense
- Objectif: Perte de poids, Maintien, Prise de masse
- Allergies/préférences alimentaires (optionnel)

**Calculs à implémenter** (dans `lib/nutrition/`):

```typescript
// BMI (Indice de Masse Corporelle)
export function calculateBMI(weight: number, height: number): number {
  return weight / Math.pow(height / 100, 2);
}

// BMR (Métabolisme de Base) - Formule de Mifflin-St Jeor
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: "male" | "female"
): number {
  if (sex === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// TDEE (Dépense Énergétique Totale Quotidienne)
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * multipliers[activityLevel];
}

// Masse grasse estimée - Formule de Jackson-Pollock (simplifiée)
export function estimateBodyFat(
  bmi: number,
  age: number,
  sex: "male" | "female"
): number {
  if (sex === "male") {
    return 1.2 * bmi + 0.23 * age - 16.2;
  }
  return 1.2 * bmi + 0.23 * age - 5.4;
}

// Poids idéal - Formule de Lorentz
export function calculateIdealWeight(
  height: number,
  sex: "male" | "female"
): number {
  if (sex === "male") {
    return height - 100 - (height - 150) / 4;
  }
  return height - 100 - (height - 150) / 2.5;
}

// Répartition macronutriments selon l'objectif
export function calculateMacros(
  calories: number,
  goal: "lose" | "maintain" | "gain"
): { protein: number; carbs: number; fat: number } {
  let proteinRatio, carbsRatio, fatRatio;

  switch (goal) {
    case "lose":
      proteinRatio = 0.35;
      carbsRatio = 0.3;
      fatRatio = 0.35;
      break;
    case "gain":
      proteinRatio = 0.3;
      carbsRatio = 0.45;
      fatRatio = 0.25;
      break;
    default: // maintain
      proteinRatio = 0.3;
      carbsRatio = 0.4;
      fatRatio = 0.3;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal/g
    carbs: Math.round((calories * carbsRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9), // 9 cal/g
  };
}
```

### 3. Dashboard et visualisations

**Composants principaux**:

1. **DailyProgress.tsx**:

   - Barres de progression pour calories et macros
   - Comparaison consommé vs. objectif
   - Code couleur: vert (dans la cible), orange (proche), rouge (dépassé)

2. **MealHistory.tsx**:

   - Timeline des repas de la journée
   - Vignettes des photos avec résumé nutritionnel
   - Filtres par date

3. **WeeklyChart.tsx**:

   - Graphique en ligne des calories sur 7 jours
   - Graphique en barres empilées des macros
   - Utiliser `recharts` ou `chart.js`

4. **RecommendationCard.tsx**:
   - Conseils générés par Claude basés sur l'historique
   - Suggestions de repas équilibrés
   - Alertes (ex: "Manque de protéines aujourd'hui")

### 4. Schéma de base de données

```prisma
// schema.prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?

  // Profile data
  dateOfBirth   DateTime?
  sex           Sex?
  weight        Float?    // kg
  height        Float?    // cm
  activityLevel ActivityLevel?
  goal          Goal?

  // Calculated metrics (cached)
  bmi           Float?
  bmr           Float?
  tdee          Float?
  idealWeight   Float?
  bodyFatPercent Float?

  // Relations
  meals         Meal[]
  preferences   UserPreferences?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Meal {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  imageUrl    String
  mealType    MealType // breakfast, lunch, dinner, snack
  timestamp   DateTime @default(now())

  // Nutrition totals
  totalCalories  Int
  totalProtein   Float
  totalCarbs     Float
  totalFat       Float

  // AI analysis
  foods       FoodItem[]
  confidence  Float
  notes       String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model FoodItem {
  id        String @id @default(cuid())
  mealId    String
  meal      Meal   @relation(fields: [mealId], references: [id])

  name      String
  portion   String  // "150g", "1 cup", etc.
  calories  Int
  protein   Float
  carbs     Float
  fat       Float
}

model UserPreferences {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  allergies       String[]
  dislikes        String[]
  dietType        String?  // vegetarian, vegan, keto, etc.

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum Sex {
  MALE
  FEMALE
}

enum ActivityLevel {
  SEDENTARY
  LIGHT
  MODERATE
  ACTIVE
  VERY_ACTIVE
}

enum Goal {
  LOSE_WEIGHT
  MAINTAIN
  GAIN_MUSCLE
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}
```

## Étapes d'implémentation

### Phase 1: Configuration de base (Priorité: Haute)

- [ ] Installer et configurer Prisma avec PostgreSQL
- [ ] Configurer l'authentification (NextAuth.js)
- [ ] Créer le schéma de base de données
- [ ] Configurer l'API Anthropic
- [ ] Mettre en place le stockage d'images (Vercel Blob)

### Phase 2: Profil utilisateur (Priorité: Haute)

- [ ] Créer le formulaire de profil avec validation
- [ ] Implémenter tous les calculs de métriques corporelles
- [ ] Page d'affichage du profil avec métriques visuelles
- [ ] API endpoints: `POST /api/profile`, `GET /api/profile`, `PUT /api/profile`

### Phase 3: Analyse de repas (Priorité: Haute)

- [ ] Composant ImageUploader avec preview
- [ ] Intégration caméra pour mobile (getUserMedia)
- [ ] API endpoint `POST /api/analyze-meal` avec Claude Vision
- [ ] Parser et valider la réponse JSON de Claude
- [ ] Affichage des résultats avec possibilité d'ajustement manuel
- [ ] Sauvegarde du repas en base de données

### Phase 4: Dashboard (Priorité: Moyenne)

- [ ] Calcul des objectifs journaliers basés sur le profil
- [ ] Composant de progression quotidienne
- [ ] Historique des repas du jour
- [ ] Graphiques de tendances hebdomadaires
- [ ] Génération de recommandations via Claude

### Phase 5: Fonctionnalités avancées (Priorité: Basse)

- [ ] Export PDF des données nutritionnelles
- [ ] Partage de repas (optionnel)
- [ ] Mode hors-ligne avec sync
- [ ] Notifications push pour rappels de repas
- [ ] Intégration avec Apple Health / Google Fit

## Conventions de code

### Style TypeScript

- Utiliser `interface` pour les types de données, `type` pour les unions/intersections
- Nommer les types avec PascalCase: `UserProfile`, `MealAnalysis`
- Préférer les named exports aux default exports (sauf pour les pages Next.js)

### Composants React

- Un composant par fichier
- Props typées avec TypeScript
- Utiliser les Server Components par défaut, ajouter `"use client"` seulement si nécessaire
- Organiser les imports: React → Next.js → Third-party → Internal → Types

### Naming conventions

- Composants: PascalCase (`MealCard.tsx`)
- Utilitaires: camelCase (`calculateBMI.ts`)
- Constantes: UPPER_SNAKE_CASE
- CSS classes: kebab-case avec Tailwind

### API Routes

- Toujours valider les inputs avec Zod
- Retourner des erreurs structurées: `{ error: "message", code: "ERROR_CODE" }`
- Logger les erreurs avec contexte suffisant
- Utiliser des status codes HTTP appropriés

## Variables d'environnement

```env
# Database
DATABASE_URL="postgresql://..."

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Storage
BLOB_READ_WRITE_TOKEN="..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Optional
USDA_API_KEY="..."
```

## Commandes utiles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement avec Turbopack

# Base de données
npx prisma generate      # Générer le client Prisma
npx prisma db push       # Pousser le schéma vers la DB
npx prisma studio        # Interface graphique DB

# Build
npm run build            # Build de production
npm start               # Démarrer le serveur de production

# Qualitép
npm run lint            # Linter le code
npm run type-check      # Vérifier les types TypeScript
```

## Considérations de sécurité

1. **Upload d'images**:

   - Limiter la taille des fichiers (max 5MB)
   - Valider les types MIME (JPEG, PNG, WebP uniquement)
   - Scanner pour malware si possible

2. **API Anthropic**:

   - Ne jamais exposer la clé API côté client
   - Implémenter rate limiting
   - Logger les appels pour monitoring des coûts

3. **Données utilisateur**:
   - Chiffrer les données sensibles
   - Implémenter GDPR compliance (export/suppression de données)
   - Valider toutes les entrées utilisateur

## Notes importantes

- **Précision des estimations**: Toujours indiquer à l'utilisateur que les calculs sont des estimations
- **Responsabilité médicale**: Ajouter un disclaimer indiquant que l'app n'est pas un substitut à un avis médical
- **Performance**: Optimiser les images uploadées avant envoi à Claude (resize, compression)
- **Coûts API**: Claude Vision coûte ~$3 par 1000 images (Sonnet 3.5). Prévoir un système de quotas si nécessaire
- **Accessibilité**: S'assurer que tous les composants sont accessibles (ARIA labels, keyboard navigation)

## Configuration Supabase + Prisma

### Étape 1: Créer un projet Supabase

1. **Créer un compte sur Supabase**:

   - Aller sur [https://supabase.com](https://supabase.com)
   - Créer un compte gratuit ou se connecter

2. **Créer un nouveau projet**:

   - Cliquer sur "New Project"
   - Nom du projet: `food-tracker` (ou au choix)
   - Database Password: **Choisir un mot de passe fort et le sauvegarder**
   - Région: Choisir la plus proche (ex: Europe West pour l'Europe)
   - Cliquer sur "Create new project"
   - ⏱️ Attendre ~2 minutes que le projet soit provisionné

3. **Récupérer les credentials**:
   - Dans le dashboard, aller dans **Settings** → **Database**
   - Copier la **Connection String** (sous "Connection string")
   - Format: `postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`

### Étape 2: Configurer les variables d'environnement

1. **Copier le fichier .env.example**:

```bash
cp .env.example .env
```

2. **Remplir le fichier .env**:

```env
# Remplacer [YOUR-PASSWORD] par votre mot de passe Supabase
# Remplacer [YOUR-PROJECT-REF] par votre ref (ex: abcdefghijklmnop)

# Connection poolée (pour Prisma avec connexions multiples)
DATABASE_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# Connection directe (pour migrations Prisma)
DIRECT_URL="postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="générer-avec: openssl rand -base64 32"

# Supabase Keys (optionnel pour client direct)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-anon-key"
```

3. **Générer le secret NextAuth**:

```bash
openssl rand -base64 32
```

### Étape 3: Appliquer le schéma Prisma à Supabase

1. **Générer le client Prisma**:

```bash
npx prisma generate
```

2. **Créer les migrations**:

```bash
npx prisma migrate dev --name init
```

3. **Vérifier dans Supabase**:
   - Aller dans **Table Editor** dans le dashboard Supabase
   - Vous devriez voir toutes les tables: User, Account, Session, Meal, FoodItem, etc.

### Étape 4: Explorer la base de données (optionnel)

**Prisma Studio** (interface graphique locale):

```bash
npx prisma studio
```

Ouvre http://localhost:5555 avec une interface pour voir/éditer les données

**Supabase Table Editor**:

- Dans le dashboard Supabase → **Table Editor**
- Interface web pour gérer les données directement

### Architecture Base de Données

Le schéma Prisma complet est dans `prisma/schema.prisma`:

**Tables principales**:

- `User`: Profil utilisateur + métriques calculées + onboarding status
- `Account`, `Session`, `VerificationToken`: Gérées par NextAuth.js
- `Meal`: Repas analysés avec nutrition totale
- `FoodItem`: Aliments détectés dans chaque repas
- `UserPreferences`: Allergies, régime alimentaire
- `WeightHistory`: Suivi du poids dans le temps

**Enums**:

- `Sex`: MALE, FEMALE, OTHER
- `ActivityLevel`: SEDENTARY, LIGHT, MODERATE, ACTIVE, VERY_ACTIVE
- `Goal`: LOSE_WEIGHT, MAINTAIN, GAIN_MUSCLE
- `MealType`: BREAKFAST, LUNCH, DINNER, SNACK

### Commandes Prisma Utiles

```bash
# Générer le client après modification du schema
npx prisma generate

# Créer une nouvelle migration
npx prisma migrate dev --name description_du_changement

# Appliquer les migrations en production
npx prisma migrate deploy

# Réinitialiser la DB (⚠️ supprime toutes les données)
npx prisma migrate reset

# Ouvrir Prisma Studio
npx prisma studio

# Formater le schema.prisma
npx prisma format

# Valider le schema sans l'appliquer
npx prisma validate
```

### Connexion à Supabase depuis le code

**Prisma Client** (recommandé pour l'app):

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Supabase Client** (optionnel, pour features Supabase spécifiques):

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Troubleshooting

**Erreur "Can't reach database server"**:

- Vérifier que le mot de passe dans DATABASE_URL est correct
- Vérifier que le projet Supabase est bien démarré (dashboard)
- Vérifier la connexion internet

**Erreur lors des migrations**:

- Utiliser `DIRECT_URL` pour les migrations (pas la connexion poolée)
- Vérifier que la base est accessible

**Prisma Client non généré**:

```bash
npx prisma generate
```

## Ressources et documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Anthropic Claude API](https://docs.anthropic.com/en/api/getting-started)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [NextAuth.js Docs](https://next-auth.js.org/getting-started/introduction)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide.html)
- [Formules nutritionnelles](https://en.wikipedia.org/wiki/Basal_metabolic_rate)

---

**Dernière mise à jour**: 2025-11-12
