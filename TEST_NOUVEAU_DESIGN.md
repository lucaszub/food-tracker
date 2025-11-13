# Comment tester le nouveau design

## ✅ Le serveur de développement fonctionne

Le serveur est lancé sur: http://localhost:3000

## 🎨 Pages avec le nouveau design

Les nouvelles pages modernes sont dans des fichiers séparés pour ne pas casser l'existant:

### Fichiers créés:
- `app/dashboard/modern-page.tsx` - Dashboard avec le nouveau style
- `app/analyze/modern-page.tsx` - Page d'analyse modernisée
- `app/explore/page.tsx` - Page Explore (nouvelle)
- `app/saved/page.tsx` - Page Favoris (nouvelle)

### Composants UI créés:
- `components/ui/bottom-nav.tsx` - Navigation mobile en bas
- `components/ui/category-pill.tsx` - Pills colorées rondes
- `components/ui/search-bar.tsx` - Barre de recherche moderne
- `components/nutrition/modern-meal-card.tsx` - Cards de repas style "Featured"

## 🔧 Comment activer le nouveau design

### Option 1: Tester sur une route temporaire

Créer `app/dashboard-v2/page.tsx`:
```typescript
import ModernDashboardPage from "../dashboard/modern-page"
export default ModernDashboardPage
```

Puis visiter: http://localhost:3000/dashboard-v2

### Option 2: Remplacer temporairement la page dashboard

```bash
# Sauvegarder l'ancien
mv app/dashboard/page.tsx app/dashboard/old-page.tsx

# Activer le nouveau
mv app/dashboard/modern-page.tsx app/dashboard/page.tsx
```

Puis visiter: http://localhost:3000/dashboard

**⚠️ N'oubliez pas de remettre les fichiers après les tests!**

### Option 3: Import conditionnel (Recommandé)

Modifier `app/dashboard/page.tsx`:
```typescript
// Ajouter en haut du fichier
const USE_NEW_DESIGN = true // Mettre à false pour revenir à l'ancien

// À la fin du fichier, avant export default
import ModernDashboardPage from "./modern-page"

export default function DashboardPage() {
  if (USE_NEW_DESIGN) {
    return <ModernDashboardPage />
  }

  // ... code existant
}
```

## 🎯 Éléments à tester

### 1. Nouveau système de couleurs ✅
- Palette orange/pêche au lieu de vert
- Pills colorées (peach, pink, yellow, green, blue)
- Gradients sur les cards

### 2. Bottom Navigation ✅
- Visible sur mobile uniquement
- 5 icônes: Home, Explore, Add (FAB), Saved, Profile
- Bouton central orange surélevé
- Indicateur de page active

### 3. Dashboard moderne
- Header "Hey, Chef!" avec avatar
- Barre de recherche arrondie
- Pills de catégories scrollables horizontalement
- Meal cards avec images et overlay
- Card progression quotidienne avec gradient
- Stats macros en grille 3 colonnes

### 4. Page Analyze
- Interface mobile-first
- Upload image avec preview grande
- Sélection type de repas en grille 4 boutons
- Résultats avec card total calories en grand
- Tips en bas de page

### 5. Navigation
- Bottom nav sur mobile
- Pages Explore et Saved créées (placeholders)
- Transitions fluides

## 📱 Test sur mobile

1. Ouvrir Chrome DevTools (F12)
2. Cliquer sur l'icône mobile (Toggle device toolbar)
3. Choisir iPhone ou Android
4. Tester la navigation bottom bar
5. Tester le scroll horizontal des pills

## 🐛 Problèmes connus

1. **Build TypeScript**: Erreur de typage NextAuth (existait déjà, non lié au nouveau design)
   - Solution: Laissé avec `@ts-expect-error` pour l'instant

2. **Images**: Certaines warnings ESLint sur `<img>` dans les anciens composants
   - Les nouveaux composants utilisent `<Image />` de Next.js

## 📊 Résumé des changements

### Modifié:
- ✅ `app/globals.css` - Nouvelle palette de couleurs orange/pêche
- ✅ `lib/auth.ts` - Fix typage `strategy: "jwt" as const`

### Créé (sans toucher aux fichiers existants):
- ✅ 4 nouveaux composants UI
- ✅ 4 nouvelles pages/variants de pages
- ✅ Documentation complète (NOUVEAU_DESIGN.md)

### Intact (pas de régression):
- ✅ Toutes les pages existantes fonctionnent
- ✅ API routes non touchées
- ✅ Logique métier conservée
- ✅ Base de données non modifiée

## 🚀 Prochaines étapes suggérées

1. Tester le design sur mobile et desktop
2. Valider l'UX avec l'équipe/utilisateurs
3. Si validé: migrer toutes les pages vers le nouveau design
4. Ajouter animations (Framer Motion)
5. Optimiser les images (lazy loading, blur placeholder)
6. Créer page Profile moderne
7. Implémenter vraie page Explore
8. Système de favoris (Saved)

## 🔄 Retour en arrière

Si vous voulez revenir complètement à l'ancien design:

```bash
git checkout main app/globals.css
git checkout main lib/auth.ts
rm -rf app/dashboard/modern-page.tsx
rm -rf app/analyze/modern-page.tsx
rm -rf app/explore
rm -rf app/saved
rm -rf components/ui/bottom-nav.tsx
rm -rf components/ui/category-pill.tsx
rm -rf components/ui/search-bar.tsx
rm -rf components/nutrition/modern-meal-card.tsx
```

Ou simplement changer de branche:
```bash
git checkout main
```
