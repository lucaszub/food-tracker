# POC - Analyse de repas avec Claude Vision

## Vue d'ensemble

POC minimal pour tester l'analyse d'image de repas avec Claude Vision.

**Pas de DB, pas de Blob storage, juste l'essentiel :**
- Upload d'image (base64 en mémoire)
- Appel API Claude Vision
- Affichage résultats nutritionnels

## Architecture

```
📸 User upload image
    ↓
🔄 Convert to base64 (client)
    ↓
📡 POST /api/analyze-meal
    ↓
🤖 Claude Vision API (Anthropic)
    ↓
📊 JSON response
    ↓
✨ Display results
```

## Fichiers créés/modifiés

- `app/api/analyze-meal/route.ts` - API route avec Claude Vision
- `app/analyze/page.tsx` - Page existante mise à jour avec vraie API
- `.env` - Ajout de `ANTHROPIC_API_KEY`
- `package.json` - Installation `@anthropic-ai/sdk`

## Configuration

### 1. Ajouter votre clé API Anthropic

Modifier `.env` :
```env
ANTHROPIC_API_KEY="sk-ant-votre-cle-ici"
```

Obtenir une clé : https://console.anthropic.com/

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer le serveur

```bash
npm run dev
```

### 4. Tester

Aller sur http://localhost:3000/analyze

1. Cliquer sur "Choisir une image"
2. Sélectionner une photo de repas
3. Choisir le type de repas
4. Cliquer sur "Analyser le repas"
5. Attendre 2-5 secondes
6. Voir les résultats !

## Format de réponse Claude

```json
{
  "foods": [
    {
      "name": "Poulet grillé",
      "quantity": 150,
      "unit": "g",
      "calories": 248,
      "protein": 37.5,
      "carbs": 0,
      "fat": 9.8,
      "fiber": 0,
      "confidence": 0.9
    }
  ],
  "total": {
    "calories": 750,
    "protein": 45,
    "carbs": 80,
    "fat": 25,
    "fiber": 8
  },
  "confidence": 0.85,
  "notes": "Assiette équilibrée. Portions estimées selon standards français."
}
```

## Modèle utilisé

**Claude 3.5 Sonnet** (`claude-3-5-sonnet-20241022`)
- Meilleur rapport qualité/prix pour Vision
- ~$0.017 par analyse d'image
- Précision nutritionnelle élevée

## Limitations du POC

- ❌ Pas de sauvegarde en DB
- ❌ Pas de stockage d'images
- ❌ Pas d'authentification
- ❌ Pas d'historique
- ❌ Pas de modification manuelle des résultats
- ❌ Gestion d'erreur basique

## Prochaines étapes (après validation)

1. **Sauvegarder en DB** : Ajouter Prisma + Supabase
2. **Stockage images** : Vercel Blob ou Supabase Storage
3. **Édition résultats** : Permettre ajuster portions/aliments
4. **Historique** : Afficher repas passés
5. **Dashboard** : Intégrer dans suivi quotidien
6. **Optimisations** : Compression images, cache, validation USDA

## Coûts estimés

Pour 100 analyses :
- Claude Vision : ~$1.70
- Pas d'autres coûts (pas de storage, pas de DB)

## Troubleshooting

**Erreur "ANTHROPIC_API_KEY not found"**
→ Vérifier le fichier `.env` et redémarrer le serveur

**Timeout / Pas de réponse**
→ Vérifier la connexion internet et la validité de la clé API

**JSON parse error**
→ Claude n'a pas retourné du JSON valide, réessayer avec une autre image

**Image trop grande**
→ Limiter à ~5MB max (géré automatiquement par le navigateur)

## Test avec images d'exemple

Bonnes images pour tester :
- Assiette complète vue d'en haut
- Plats simples (pâtes, salade, viande+légumes)
- Bon éclairage, pas de flash

Mauvaises images :
- Photos floues ou sombres
- Angle de côté
- Aliments mélangés (soupes, smoothies)
- Plats très complexes

---

**Branch Git** : `poc/meal-analysis`
**Date** : 2025-11-13
**Status** : ✅ Prêt à tester
