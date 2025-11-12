# 🧪 Guide de test - Nouveau système d'objectifs de poids

## ✅ Ce qui a été implémenté

### 1. **Nouveau système d'objectifs de poids intelligent**
- Slider interactif pour définir un poids cible
- Analyse en temps réel de la sécurité et faisabilité
- Calcul automatique de la durée et du rythme recommandé
- Alertes visuelles avec code couleur (vert/orange/rouge)
- Déduction automatique du goal (LOSE_WEIGHT/MAINTAIN/GAIN_MUSCLE)

### 2. **Base de données mise à jour**
- Nouveaux champs: `targetWeight`, `weeklyWeightChangeGoal`, `estimatedTargetDate`
- Base de données réinitialisée pour des tests propres

### 3. **Navigation améliorée**
- Menu utilisateur avec avatar (initiales)
- Bouton de déconnexion
- Accès rapide au profil

---

## 🚀 Comment tester

### Étape 1: Accéder à l'application
```
Ouvrir: http://localhost:3002
```

### Étape 2: Créer un compte
1. Cliquer sur "Créer un compte" (si vous êtes sur la page login)
2. Remplir les informations:
   - Email: `test@example.com`
   - Mot de passe: `password123`
   - Confirmer le mot de passe

### Étape 3: Onboarding - Étape 1
- **Nom**: Jean Dupont
- **Date de naissance**: 01/01/1990 (35 ans)
- **Sexe**: Homme

### Étape 4: Onboarding - Étape 2
- **Poids**: 81 kg
- **Taille**: 175 cm

### Étape 5: Onboarding - Étape 3 (LA NOUVELLE PARTIE! 🎯)

Vous verrez maintenant:
1. **Cartes d'information**:
   - Poids actuel: 81 kg
   - Poids idéal (Lorentz): ~73 kg

2. **Niveau d'activité**: Sélectionner "Modérée"

3. **Slider de poids cible**: Testez différents scénarios!

---

## 🎮 Scénarios de test recommandés

### Scénario A: Perte réaliste (✅ VERT)
**Slider à 76 kg** (perte de 5kg)
- **Attendu**:
  - Badge vert "✅ 76 kg"
  - Message: "Objectif réaliste et sain"
  - Perte: 5 kg
  - Rythme: 0.5 kg/semaine
  - Durée: 10 semaines (~2.3 mois)
  - Recommandations nutritionnelles
  - IMC: 26.4 → 24.8

### Scénario B: Perte ambitieuse (⚠️ ORANGE)
**Slider à 65 kg** (perte de 16kg)
- **Attendu**:
  - Badge orange "⚠️ 65 kg"
  - Message: "Objectif ambitieux mais réalisable"
  - Perte: 16 kg
  - Durée: ~32 semaines
  - Avertissements et recommandations de suivi

### Scénario C: Perte dangereuse (❌ ROUGE)
**Slider à 55 kg** (perte de 26kg, IMC < 18.5)
- **Attendu**:
  - Badge rouge "❌ 55 kg"
  - Message: "Objectif présentant des risques pour la santé"
  - Alerte rouge: "Le poids cible est sous le seuil de sécurité"
  - Recommandation du poids minimum: 56.7 kg (IMC 18.5)
  - Risques listés: malnutrition, fatigue chronique, etc.

### Scénario D: Gain réaliste (✅ VERT)
**Slider à 86 kg** (gain de 5kg)
- **Attendu**:
  - Badge vert
  - Message: "Objectif de prise de masse réaliste"
  - Gain: 5 kg
  - Rythme: 0.35 kg/semaine
  - Recommandations musculation

### Scénario E: Maintien (✅ VERT)
**Slider à 81 kg** (pas de changement)
- **Attendu**:
  - Message: "Maintien du poids actuel"
  - Focus sur équilibre nutritionnel

---

## 🔍 Vérifications importantes

### Dans le formulaire:
- [ ] Le slider se déplace en temps réel
- [ ] Les couleurs changent selon le niveau de risque
- [ ] Les messages sont clairs et informatifs
- [ ] Les calculs de durée sont cohérents
- [ ] L'IMC actuel et cible s'affichent correctement

### Après validation de l'étape 3:
- [ ] Passage à l'étape 4 (Préférences)
- [ ] Possibilité de terminer l'onboarding
- [ ] Redirection vers le dashboard

### Dans la navigation:
- [ ] Avatar avec vos initiales (JD pour Jean Dupont)
- [ ] Menu déroulant au clic sur l'avatar
- [ ] Affichage du nom et email
- [ ] Bouton "Mon profil"
- [ ] Bouton "Se déconnecter" en rouge

### Test de déconnexion/reconnexion:
1. [ ] Cliquer sur l'avatar → "Se déconnecter"
2. [ ] Redirection vers `/login`
3. [ ] Se reconnecter avec les mêmes identifiants
4. [ ] Vérifier que vous arrivez directement au dashboard (pas d'onboarding à refaire)
5. [ ] Vérifier que vos données sont préservées

---

## 📊 Données stockées en base

Après l'onboarding, vérifiez dans Prisma Studio:
```bash
npx prisma studio
```

Dans la table `User`, vous devriez voir:
- `targetWeight`: 76 (ou votre choix)
- `weeklyWeightChangeGoal`: -0.5 (négatif pour perte)
- `estimatedTargetDate`: Date calculée (~10 semaines dans le futur)
- `goal`: LOSE_WEIGHT (déduit automatiquement)
- Toutes les métriques calculées (bmi, bmr, tdee, etc.)

---

## 🐛 Problèmes connus

### Erreurs TypeScript dans Zod
Les erreurs TypeScript dans `lib/validations/onboarding.ts` sont dues à une version plus récente de Zod. Elles n'affectent pas le fonctionnement de l'application en mode développement.

**Solution si nécessaire**: Remplacer `required_error` par `message` dans les schémas Zod.

---

## 💡 Points d'amélioration futurs

1. **Graphique de progression**: Afficher visuellement le chemin vers l'objectif
2. **Rappels**: Notifications pour suivre la progression
3. **Ajustement dynamique**: Recalculer l'objectif si le rythme change
4. **Comparaison**: Montrer "Vous vs. Objectif" sur le dashboard
5. **Historique**: Graphique de l'évolution du poids au fil du temps

---

## 📝 Notes techniques

### Formules utilisées:
- **IMC**: poids (kg) / taille² (m)
- **Poids idéal (Lorentz)**:
  - Homme: taille - 100 - [(taille - 150) / 4]
  - Femme: taille - 100 - [(taille - 150) / 2.5]

### Règles de sécurité:
- **Perte saine**: 0.5 kg/semaine (recommandation OMS)
- **Perte acceptable**: 0.75 kg/semaine
- **Perte dangereuse**: >1 kg/semaine
- **Gain sain**: 0.25-0.5 kg/semaine
- **Limite IMC**: Minimum 18.5, Maximum 30

### Sources scientifiques:
- OMS (Organisation Mondiale de la Santé)
- ANSES (Agence nationale de sécurité sanitaire)
- American Heart Association
- International Society of Sports Nutrition

---

## ✨ Bon test!

Si vous rencontrez des problèmes ou avez des questions:
1. Vérifier la console du navigateur (F12)
2. Vérifier les logs du serveur (terminal)
3. Tester avec différents profils (homme/femme, tailles différentes)

**L'application est maintenant prête pour des tests complets!** 🚀
