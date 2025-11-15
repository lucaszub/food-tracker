# Nouveau Design UX/UI - Food Tracker

## 🎨 Vue d'ensemble

Cette branche contient un redesign complet de l'interface utilisateur inspiré d'une app de recettes moderne, tout en conservant toutes les fonctionnalités de tracking nutritionnel de Food Tracker.

## 📁 Nouveaux composants créés

### 1. Navigation Bottom Bar (`components/ui/bottom-nav.tsx`)
Navigation mobile en bas d'écran avec:
- 5 icônes: Home, Explore, Add (FAB central), Saved, Settings
- Bouton central FAB (Floating Action Button) orange
- Indicateurs visuels pour la page active
- Responsive (masqué sur desktop)

### 2. Category Pills (`components/ui/category-pill.tsx`)
Boutons ronds colorés avec icônes:
- 5 couleurs pastel: peach, pink, yellow, green, blue
- Animation au clic et état actif
- Props: `icon`, `label`, `color`, `isActive`, `onClick`

### 3. Search Bar (`components/ui/search-bar.tsx`)
Barre de recherche moderne:
- Fond gris clair avec bordures arrondies
- Icône de recherche à gauche
- Hauteur fixe de 48px
- Style minimaliste

### 4. Modern Meal Card (`components/nutrition/modern-meal-card.tsx`)
Card de repas style "Featured Recipe":
- Image en arrière-plan avec overlay gradient noir
- Badge "Trending" optionnel
- Affichage: temps de préparation, calories, rating
- Bordures très arrondies (rounded-3xl)
- Effet hover et active

## 🎨 Nouveau système de couleurs

### Palette principale (Light Mode)
```css
--primary: oklch(0.65 0.18 35)        /* Orange #FF6B35 */
--secondary: oklch(0.94 0.02 60)      /* Gris très clair */
--background: oklch(0.99 0.002 60)    /* Presque blanc */
--radius: 1rem                         /* Bordures plus arrondies */
```

### Couleurs Pills (Pastels)
```css
--pill-peach: oklch(0.90 0.08 40)     /* Pêche clair */
--pill-pink: oklch(0.88 0.10 10)      /* Rose clair */
--pill-yellow: oklch(0.92 0.10 90)    /* Jaune clair */
--pill-green: oklch(0.90 0.08 140)    /* Vert clair */
--pill-blue: oklch(0.88 0.08 230)     /* Bleu clair */
```

### Charts (Macronutriments)
```css
--chart-1: Orange  (Protéines)
--chart-2: Jaune   (Glucides)
--chart-3: Vert    (Lipides)
```

## 📄 Nouvelles pages créées

### 1. Dashboard Moderne (`app/dashboard/modern-page.tsx`)
- Header avec "Hey, Chef!" personnalisé
- Avatar utilisateur
- Barre de recherche
- Pills de catégories horizontales (scrollables)
- Section "Featured" avec premier repas en grand
- Grille 2 colonnes pour repas suivants
- Card de progression quotidienne avec gradient orange
- Bottom navigation

### 2. Analyze Moderne (`app/analyze/modern-page.tsx`)
- Interface simplifiée et mobile-first
- Upload d'image avec preview full-width
- Sélection type de repas en grille 4 colonnes
- Résultats avec card arrondie
- Card total calories avec gradient
- Liste aliments détectés
- Tips en bas

### 3. Explore Page (`app/explore/page.tsx`)
- Page placeholder avec navigation
- Pills de catégories
- Prête pour développement futur

### 4. Saved Page (`app/saved/page.tsx`)
- Page favoris placeholder
- Icône bookmark
- État vide stylisé

## 🔄 Comment tester le nouveau design

### Option 1: Renommer les fichiers (Temporaire)

```bash
# Sauvegarder les anciennes pages
mv app/dashboard/page.tsx app/dashboard/old-page.tsx
mv app/analyze/page.tsx app/analyze/old-page.tsx

# Activer les nouvelles pages
mv app/dashboard/modern-page.tsx app/dashboard/page.tsx
mv app/analyze/modern-page.tsx app/analyze/page.tsx

# Lancer le serveur
npm run dev
```

### Option 2: Importer dans les pages existantes (Recommandé)

Modifier `app/dashboard/page.tsx`:
```typescript
// Au début du fichier
import ModernDashboardPage from "./modern-page"

export default function DashboardPage() {
  return <ModernDashboardPage />
}
```

### Option 3: Route parallèle

Créer `app/dashboard-v2/page.tsx` qui importe `modern-page.tsx`

## 🎯 Fonctionnalités conservées

✅ Toutes les fonctionnalités Food Tracker sont conservées:
- Analyse de repas via API Claude
- Calcul nutritionnel (calories, macros)
- Profil utilisateur
- Métriques corporelles (BMI, BMR, TDEE, etc.)
- Historique des repas
- Recommandations personnalisées
- Authentification

## 🔧 Personnalisation

### Changer la couleur primaire

Dans `app/globals.css`:
```css
:root {
  --primary: oklch(0.65 0.18 35); /* Modifier ces valeurs */
}
```

Exemples de couleurs:
- Rouge: `oklch(0.65 0.18 25)`
- Vert: `oklch(0.65 0.18 150)`
- Bleu: `oklch(0.65 0.18 230)`
- Violet: `oklch(0.65 0.18 300)`

### Modifier les pills

Ajouter une nouvelle couleur dans `globals.css`:
```css
:root {
  --pill-purple: oklch(0.88 0.10 300);
}

.pill-purple {
  background-color: var(--pill-purple);
}
```

## 📱 Responsive Design

- **Mobile**: Bottom navigation visible, layout 1 colonne
- **Tablet (md)**: Bottom nav cachée, layout 2 colonnes
- **Desktop (lg)**: Navigation sidebar (à implémenter), layout multi-colonnes

## 🚀 Prochaines étapes

1. **Intégrer l'API réelle** dans les nouvelles pages
2. **Créer la page Profile moderne** avec le même style
3. **Implémenter la page History** avec timeline
4. **Ajouter animations** (Framer Motion)
5. **Créer page Explore** fonctionnelle
6. **Système de favoris** (Saved page)
7. **Dark mode** optimisé pour le nouveau design
8. **Notifications** toast modernes

## 🎨 Design System

### Espacements
- Padding cards: `p-6` (24px)
- Gaps: `gap-4` (16px) ou `gap-6` (24px)
- Marges sections: `mb-8` (32px)

### Bordures
- Cards principales: `rounded-3xl` (24px)
- Petits éléments: `rounded-2xl` (16px)
- Pills/Boutons: `rounded-full`

### Typography
- Titres H1: `text-3xl font-bold`
- Titres H2: `text-xl font-bold`
- Titres H3: `text-lg font-semibold`
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Tiny: `text-xs` (12px)

### Effets
- Hover cards: `hover:scale-[1.02]`
- Active: `active:scale-[0.98]`
- Transitions: `transition-transform` ou `transition-colors`

## 🐛 Notes importantes

- Les pages modernes sont dans des fichiers séparés (`modern-page.tsx`)
- L'ancienne UI reste accessible dans `page.tsx`
- La navigation bottom bar est mobile-only (caché sur desktop)
- Les images de repas utilisent des placeholders si pas d'URL
- Le système de pills utilise des classes CSS custom

## 📚 Ressources

- Design inspiré de: [Screenshot fourni]
- Palette de couleurs: OKLCH pour support dark mode
- Icônes: Lucide React
- Components: shadcn/ui (customisés)
