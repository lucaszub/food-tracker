# Configuration Base de Données Cloud avec Prisma

## 🎯 Objectif

Mettre en place une base de données cloud PostgreSQL optimisée pour le projet Food Tracker, en utilisant les solutions natives Prisma ou des alternatives serverless recommandées.

## 📊 Solutions Cloud Disponibles

### Option 1 : **Prisma Postgres** (Recommandé - Solution Native)

Base de données PostgreSQL managée par Prisma avec performance optimale.

**Avantages:**
- ✅ Intégration native avec Prisma ORM
- ✅ Zero cold starts (bare metal + unikernels)
- ✅ Global caching layer intégré
- ✅ Connection pooling inclus
- ✅ Auto-scaling automatique
- ✅ AI-powered performance recommendations
- ✅ 15+ régions mondiales

**Tarification:**
```
Free Tier (sans CB):
- 100,000 opérations/mois
- 500 MB stockage
- 5 bases de données

Starter ($10/mois):
- 1,000,000 opérations incluses
- 10 GB stockage
- $0.008 par 1,000 ops après

Pro ($49/mois):
- 10,000,000 opérations incluses
- 50 GB stockage
- Backups quotidiens (7 jours)
```

**Estimation pour Food Tracker:**
- Free tier : Suffisant pour ~500 utilisateurs actifs
- Starter : Jusqu'à ~5,000 utilisateurs
- 1 analyse de repas ≈ 10-20 opérations DB

---

### Option 2 : **Neon** (Recommandé - Serverless)

PostgreSQL serverless avec database branching.

**Avantages:**
- ✅ True serverless (auto-suspend = $0 quand inactif)
- ✅ Database branching (clones instantanés pour dev/preview)
- ✅ Cold start < 500ms
- ✅ Connection pooling intégré
- ✅ Excellente intégration Prisma
- ✅ Perfect pour Vercel deployments

**Tarification:**
```
Free Tier:
- 0.5 GB stockage
- 512 MB compute
- 10 branches
- Pas de CB

Scale ($19/mois):
- 10 GB stockage
- Compute illimité
- Branches illimitées
```

**Parfait pour:**
- Déploiements Vercel
- Environnements de preview
- Projets serverless

---

### Option 3 : **Prisma Accelerate** (Add-on Performance)

⚠️ **Ce n'est PAS une base de données** - c'est un add-on qui fonctionne avec n'importe quelle DB.

**Fonctionnalités:**
- Global connection pooling (15+ régions)
- Query-level caching (300+ edge locations)
- Response times: ~5ms (vs 5s sans)
- Réduit la charge DB de 70%+

**Cas d'usage:**
- Applications serverless (Vercel, Netlify)
- Traffic global
- Optimisation performance

**Tarification:**
```
Free Tier:
- 60,000 queries/mois

Paid: Scale selon usage
```

**Utilisation:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())

// Cache user profiles (rarement modifiés)
const user = await prisma.user.findUnique({
  where: { id: userId },
  cacheStrategy: {
    swr: 300,  // Stale-while-revalidate: 5 min
    ttl: 300   // Time-to-live: 5 min
  }
})

// Pas de cache pour les repas (data fresh)
const meals = await prisma.meal.findMany({
  where: { userId }
  // Pas de cacheStrategy = toujours fresh
})
```

---

## 🎯 Recommandation pour Food Tracker

### **Setup Initial (MVP)**

**Solution recommandée : Prisma Postgres Free Tier**

**Pourquoi :**
- Gratuit jusqu'à 100k opérations/mois
- Pas de CB requise
- Intégration native parfaite
- Performance optimale dès le départ
- 5 databases (dev, staging, prod, test, preview)

**Quand upgrader :**
- > 500 utilisateurs actifs → Starter ($10/mois)
- > 5,000 utilisateurs → Pro ($49/mois)

---

### **Setup Production (Scale)**

**Stack recommandé:**
```
Database: Prisma Postgres (ou Neon)
Performance: + Prisma Accelerate (quand traffic > 10k req/jour)
Real-time: + Prisma Pulse (si features temps réel nécessaires)
```

**Coût estimé:**
```
0-500 users:     $0/mois (free tiers)
500-5k users:    $10-20/mois (Starter + Accelerate free)
5k-50k users:    $50-100/mois (Pro + Accelerate paid)
```

---

## 📋 Plan d'Implémentation

### Phase 1 : Setup Prisma Postgres (Immédiat)

#### Étape 1 : Créer un compte Prisma Data Platform

```bash
# 1. Aller sur https://console.prisma.io/
# 2. Sign up avec GitHub
# 3. Créer un nouveau projet "food-tracker"
```

#### Étape 2 : Créer une base de données

```bash
# Dans Prisma Console:
# 1. Cliquer "Create Database"
# 2. Choisir "Prisma Postgres"
# 3. Région: Europe (eu-west-1)
# 4. Nom: food-tracker-db
# 5. Plan: Free
```

#### Étape 3 : Récupérer la connection string

```env
# Prisma Console vous donne une URL comme:
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJ..."
```

#### Étape 4 : Configurer le projet

```bash
# .env
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJ..."

# Pas besoin de DIRECT_URL avec Prisma Postgres
# (le pooling est natif)
```

#### Étape 5 : Mettre à jour schema.prisma

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Le reste reste identique
```

#### Étape 6 : Appliquer les migrations

```bash
# Générer le client
npx prisma generate

# Créer les tables
npx prisma db push

# Vérifier avec Prisma Studio
npx prisma studio
```

---

### Phase 2 : Optimisation avec Accelerate (Plus tard)

Quand le traffic augmente (> 10,000 requêtes/jour):

```bash
# 1. Activer Accelerate dans Prisma Console
# 2. Installer l'extension
npm install @prisma/extension-accelerate

# 3. Mettre à jour lib/prisma.ts
import { withAccelerate } from '@prisma/extension-accelerate'

export const prisma = new PrismaClient().$extends(withAccelerate())
```

**Stratégies de cache:**

```typescript
// ✅ CACHER (data statique ou rarement modifiée)
// - Profils utilisateurs
// - Objectifs nutritionnels calculés
// - Référentiel d'aliments

const userProfile = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    bmi: true,
    bmr: true,
    tdee: true,
    dailyCalories: true,
    dailyProtein: true,
    dailyCarbs: true,
    dailyFat: true
  },
  cacheStrategy: { swr: 3600, ttl: 3600 } // 1 heure
})

// ❌ NE PAS CACHER (data dynamique)
// - Repas du jour
// - Historique de poids récent
// - Analyses en cours

const todaysMeals = await prisma.meal.findMany({
  where: {
    userId,
    timestamp: { gte: startOfDay(new Date()) }
  }
  // Pas de cacheStrategy = toujours fresh
})
```

---

### Phase 3 : Real-time avec Pulse (Optionnel)

Si besoin de features temps réel (dashboard live, notifications):

```bash
npm install @prisma/extension-pulse
```

```typescript
import { withPulse } from '@prisma/extension-pulse'

const prisma = new PrismaClient().$extends(
  withPulse({ apiKey: process.env.PULSE_API_KEY })
)

// Subscribe aux nouveaux repas
const subscription = await prisma.meal.stream({
  create: {}
})

for await (const event of subscription) {
  console.log('Nouveau repas créé:', event)
  // Mettre à jour le dashboard en temps réel
}
```

---

## 🔄 Migration depuis SQLite (actuel)

### Étape 1 : Export des données existantes

```bash
# Si vous avez des données de test à conserver
npx prisma db seed
# ou
sqlite3 dev.db .dump > backup.sql
```

### Étape 2 : Changer la connexion

```env
# Avant (SQLite)
DATABASE_URL="file:./dev.db"

# Après (Prisma Postgres)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJ..."
```

### Étape 3 : Push le schéma

```bash
npx prisma db push
```

### Étape 4 : (Optionnel) Import données

```bash
# Si vous aviez des données à migrer
npx prisma db seed
```

---

## 🆚 Comparaison des Options

| Critère | Prisma Postgres | Neon | SQLite (actuel) |
|---------|-----------------|------|-----------------|
| **Type** | Managed PostgreSQL | Serverless PostgreSQL | Local file |
| **Free Tier** | 100k ops/mois | 0.5 GB | Illimité (local) |
| **Performance** | Excellent | Très bon | Bon (local) |
| **Serverless** | Oui | Oui | Non |
| **Pooling** | Natif | Natif | N/A |
| **Branching** | Non | Oui | Non |
| **Cold Start** | 0ms | <500ms | 0ms |
| **Scaling** | Auto | Auto | Manuel |
| **Production Ready** | ✅ | ✅ | ❌ (dev only) |
| **Setup** | Très simple | Simple | Le plus simple |
| **Intégration Prisma** | Native | Excellente | Bonne |

---

## 📝 Checklist de Setup

- [ ] Créer compte Prisma Data Platform
- [ ] Créer database Prisma Postgres
- [ ] Copier connection string
- [ ] Mettre à jour `.env`
- [ ] Push schema avec `npx prisma db push`
- [ ] Tester avec `npx prisma studio`
- [ ] Vérifier connexion app (npm run dev)
- [ ] Tester création d'un repas
- [ ] Commit changements

---

## 🔗 Ressources

- [Prisma Data Platform](https://console.prisma.io/)
- [Prisma Postgres Docs](https://www.prisma.io/docs/orm/overview/databases/prisma-postgres)
- [Prisma Accelerate Docs](https://www.prisma.io/docs/accelerate/getting-started)
- [Neon + Prisma Guide](https://neon.tech/docs/guides/prisma)
- [Prisma Pricing Calculator](https://calculator.prisma.io/)

---

## 💡 Prochaines Étapes

Après setup de la DB:

1. **Intégrer sauvegarde des repas** : API `/api/meals` CRUD
2. **Stockage d'images** : Vercel Blob ou Cloudinary
3. **Historique** : Page `/history` avec filtres
4. **Dashboard** : Graphiques de progression
5. **Goals tracking** : Suivi objectifs nutritionnels

---

**Status** : 📝 Documentation ready
**Date** : 2025-11-13
**Branch** : `setup/prisma-cloud-db`
