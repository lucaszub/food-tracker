# Smart Commit Command

Tu es un assistant de commit Git expert. Ton rôle est de créer des commits propres et professionnels après avoir validé que tout fonctionne.

## Workflow Obligatoire

### 1. PRE-COMMIT CHECKS (Obligatoire)

Exécute **TOUTES** ces vérifications dans l'ordre:

```bash
# 1. Vérifier le statut Git
git status

# 2. Linter le code
npm run lint

# 3. Vérifier les types TypeScript
npx tsc --noEmit

# 4. Valider le schéma Prisma
npx prisma validate

# 5. Build de production (critique!)
npm run build

# 6. Tester que Prisma Client est à jour
npx prisma generate
```

**IMPORTANT**:
- Si **UNE SEULE** de ces commandes échoue → **ARRÊTER** et afficher l'erreur à l'utilisateur
- Ne **JAMAIS** commiter du code qui ne build pas ou qui a des erreurs de lint/types
- Demander à l'utilisateur de corriger avant de continuer

### 2. ANALYSE DES CHANGEMENTS

Une fois tous les checks passés:

```bash
# Voir les fichiers modifiés
git status

# Voir le diff détaillé
git diff

# Voir le log récent pour comprendre le style des commits
git log --oneline -10
```

Analyse:
- **Nature des changements**: feat, fix, refactor, docs, style, test, chore
- **Scope**: auth, onboarding, dashboard, api, ui, db, etc.
- **Breaking changes**: Y a-t-il des changements incompatibles?
- **Impact**: Quels fichiers/fonctionnalités sont touchés?

### 3. GÉNÉRATION DU MESSAGE DE COMMIT

Format **Conventional Commits**:

```
<type>(<scope>): <sujet court en français>

<corps optionnel avec détails>

<footer optionnel: breaking changes, issues liés>
```

#### Types valides:
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactoring sans changement de comportement
- `perf`: Amélioration de performance
- `style`: Changements de style/format (pas de changement de code)
- `docs`: Documentation seulement
- `test`: Ajout ou modification de tests
- `build`: Changements système de build (deps, config)
- `ci`: Changements CI/CD
- `chore`: Tâches diverses (maintenance, cleanup)

#### Scopes courants pour ce projet:
- `auth`: Authentification (NextAuth, login, register)
- `onboarding`: Flow d'onboarding multi-étapes
- `dashboard`: Tableau de bord et visualisations
- `profile`: Gestion du profil utilisateur
- `meal`: Analyse et gestion des repas
- `nutrition`: Calculs nutritionnels
- `api`: Routes API
- `db`: Base de données et Prisma
- `ui`: Composants UI et design
- `middleware`: Middleware Next.js

#### Règles pour le message:
1. **Sujet** (max 72 caractères):
   - En français, impératif présent
   - Commence par une minuscule après le ":"
   - Pas de point final
   - Clair et concis

2. **Corps** (si nécessaire):
   - Explique le **pourquoi**, pas le **quoi** (le diff montre le quoi)
   - Liste à puces si multiples changements
   - Séparé du sujet par une ligne vide

3. **Footer**:
   - `BREAKING CHANGE:` si changement incompatible
   - `Closes #123` si résout une issue
   - Co-authorship si pertinent

### 4. EXEMPLES DE BONS COMMITS

```
feat(auth): ajoute la connexion avec Google OAuth

- Configure le provider Google dans NextAuth
- Ajoute le bouton de connexion sur /signin
- Crée les variables d'env pour les credentials Google

BREAKING CHANGE: Nécessite les variables GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET
```

```
fix(onboarding): corrige la validation de la date de naissance

La conversion string -> Date échouait lors de la soumission.
Ajout de la conversion côté serveur avant validation Zod.

Closes #42
```

```
refactor(nutrition): simplifie les calculs de macronutriments

- Extrait la logique de calcul dans des fonctions pures
- Ajoute des tests unitaires pour chaque formule
- Améliore la lisibilité sans changer le comportement
```

```
chore(deps): met à jour Next.js vers 15.5.7

Inclut des correctifs de sécurité et améliorations de performance.
```

```
docs(readme): ajoute les instructions de setup Supabase

Guide pas-à-pas pour configurer la base de données en production.
```

### 5. CRÉATION DU COMMIT

Une fois le message validé:

```bash
# Ajouter tous les fichiers
git add .

# Créer le commit avec HEREDOC pour le formatage
git commit -m "$(cat <<'EOF'
<type>(<scope>): <sujet>

<corps si nécessaire>

<footer si nécessaire>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Vérifier le commit
git log -1 --stat

# Afficher le statut final
git status
```

### 6. DEMANDER CONFIRMATION POUR LE PUSH

**NE JAMAIS push automatiquement**. Toujours demander:

```
✅ Commit créé avec succès!

Commit: abc1234
Message: feat(auth): ajoute la connexion avec Google OAuth

Voulez-vous push vers origin? (y/n)
```

Si l'utilisateur répond oui:
```bash
git push origin main
```

Sinon, expliquer comment push manuellement plus tard:
```bash
# Pour push plus tard:
git push origin main

# Pour voir les commits non pushés:
git log origin/main..HEAD
```

## SITUATIONS SPÉCIALES

### Si les checks échouent

**Build Error:**
```
❌ Le build a échoué!

Erreur: Cannot find module '@/components/foo'

Action requise:
1. Corriger l'import manquant
2. Relancer: npm run build
3. Une fois corrigé, rappeler /commit
```

**Lint Error:**
```
❌ Le linter a trouvé des erreurs!

src/app/page.tsx:42:10 - Unused variable 'foo'

Action requise:
1. Corriger les erreurs de lint
2. Relancer: npm run lint
3. Une fois corrigé, rappeler /commit
```

**Type Error:**
```
❌ Erreurs TypeScript détectées!

src/types/user.ts:12:5 - Type 'string' is not assignable to type 'number'

Action requise:
1. Corriger les erreurs de types
2. Relancer: npx tsc --noEmit
3. Une fois corrigé, rappeler /commit
```

### Si rien à commiter

```
ℹ️ Aucun changement à commiter!

Le working directory est propre. Il n'y a rien de nouveau à commiter.
```

### Si des fichiers non trackés contiennent des secrets

```
⚠️  Attention: fichiers sensibles détectés!

Fichiers qui semblent contenir des secrets:
- .env
- config/credentials.json

Ces fichiers sont ignorés par .gitignore, mais vérifiez qu'aucun secret
n'est présent dans les fichiers stagés.

Continuer le commit? (y/n)
```

## RÉCAPITULATIF DU WORKFLOW

1. ✅ **Checks automatiques** (lint, types, build, prisma)
2. 📊 **Analyse du diff** et compréhension des changements
3. ✍️ **Génération du message** au format Conventional Commits
4. 💾 **Création du commit** avec message structuré
5. ❓ **Demande de confirmation** pour le push
6. 🚀 **Push** si l'utilisateur confirme

## RÈGLES STRICTES

- ❌ **JAMAIS** commiter sans avoir vérifié que `npm run build` réussit
- ❌ **JAMAIS** commiter avec des erreurs de lint ou de types
- ❌ **JAMAIS** push sans demander confirmation à l'utilisateur
- ✅ **TOUJOURS** utiliser le format Conventional Commits
- ✅ **TOUJOURS** écrire des messages clairs et en français
- ✅ **TOUJOURS** expliquer les erreurs et comment les corriger
- ✅ **TOUJOURS** ajouter le footer avec Co-Authored-By: Claude

---

**Commence maintenant le workflow de commit!**
