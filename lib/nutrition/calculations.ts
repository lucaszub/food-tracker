// Calculs nutritionnels basés sur les formules scientifiques

export type Sex = 'MALE' | 'FEMALE' | 'OTHER'
export type ActivityLevel = 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE'
export type Goal = 'LOSE_WEIGHT' | 'MAINTAIN' | 'GAIN_MUSCLE'

/**
 * Calcule l'IMC (Indice de Masse Corporelle)
 * @param weight - Poids en kg
 * @param height - Taille en cm
 * @returns IMC arrondi à 1 décimale
 */
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  const bmi = weight / Math.pow(heightInMeters, 2)
  return Math.round(bmi * 10) / 10
}

/**
 * Calcule le BMR (Basal Metabolic Rate) - Métabolisme de base
 * Utilise la formule de Mifflin-St Jeor (la plus précise)
 * @param weight - Poids en kg
 * @param height - Taille en cm
 * @param age - Âge en années
 * @param sex - Sexe (MALE ou FEMALE)
 * @returns BMR en kcal/jour
 */
export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  sex: Sex
): number {
  if (sex === 'MALE') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  }
  // FEMALE ou OTHER (utilise formule femme par défaut)
  return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
}

/**
 * Calcule le TDEE (Total Daily Energy Expenditure) - Dépense énergétique totale quotidienne
 * @param bmr - Métabolisme de base
 * @param activityLevel - Niveau d'activité
 * @returns TDEE en kcal/jour
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    SEDENTARY: 1.2,    // Peu ou pas d'exercice
    LIGHT: 1.375,      // Exercice léger 1-3 jours/semaine
    MODERATE: 1.55,    // Exercice modéré 3-5 jours/semaine
    ACTIVE: 1.725,     // Exercice intense 6-7 jours/semaine
    VERY_ACTIVE: 1.9   // Exercice très intense + travail physique
  }

  return Math.round(bmr * multipliers[activityLevel])
}

/**
 * Estime la masse grasse en pourcentage
 * Utilise la formule de Jackson-Pollock (simplifiée via IMC)
 * @param bmi - Indice de masse corporelle
 * @param age - Âge en années
 * @param sex - Sexe
 * @returns Pourcentage de masse grasse arrondi à 1 décimale
 */
export function estimateBodyFat(bmi: number, age: number, sex: Sex): number {
  let bodyFat: number

  if (sex === 'MALE') {
    bodyFat = 1.20 * bmi + 0.23 * age - 16.2
  } else {
    // FEMALE ou OTHER
    bodyFat = 1.20 * bmi + 0.23 * age - 5.4
  }

  // S'assurer que le résultat est dans une plage réaliste
  return Math.max(3, Math.min(50, Math.round(bodyFat * 10) / 10))
}

/**
 * Calcule le poids idéal selon la formule de Lorentz
 * @param height - Taille en cm
 * @param sex - Sexe
 * @returns Poids idéal en kg arrondi à 1 décimale
 */
export function calculateIdealWeight(height: number, sex: Sex): number {
  let idealWeight: number

  if (sex === 'MALE') {
    idealWeight = height - 100 - ((height - 150) / 4)
  } else {
    // FEMALE ou OTHER
    idealWeight = height - 100 - ((height - 150) / 2.5)
  }

  return Math.round(idealWeight * 10) / 10
}

/**
 * Calcule les objectifs caloriques quotidiens selon le goal
 * @param tdee - Dépense énergétique totale quotidienne
 * @param goal - Objectif (perte de poids, maintien, prise de masse)
 * @returns Calories quotidiennes cibles
 */
export function calculateDailyCalories(tdee: number, goal: Goal): number {
  switch (goal) {
    case 'LOSE_WEIGHT':
      // Déficit de 20% pour perte de poids saine (0.5kg/semaine)
      return Math.round(tdee * 0.8)
    case 'GAIN_MUSCLE':
      // Surplus de 10% pour prise de masse
      return Math.round(tdee * 1.1)
    case 'MAINTAIN':
    default:
      return tdee
  }
}

/**
 * Calcule la répartition des macronutriments en grammes
 * @param calories - Objectif calorique quotidien
 * @param goal - Objectif (perte de poids, maintien, prise de masse)
 * @returns Objet avec grammes de protéines, glucides et lipides
 */
export function calculateMacros(
  calories: number,
  goal: Goal
): { protein: number; carbs: number; fat: number } {
  let proteinRatio: number, carbsRatio: number, fatRatio: number

  switch (goal) {
    case 'LOSE_WEIGHT':
      // Plus de protéines pour préserver la masse musculaire
      proteinRatio = 0.35  // 35% des calories
      carbsRatio = 0.30    // 30% des calories
      fatRatio = 0.35      // 35% des calories
      break
    case 'GAIN_MUSCLE':
      // Plus de glucides pour l'énergie et la construction musculaire
      proteinRatio = 0.30  // 30% des calories
      carbsRatio = 0.45    // 45% des calories
      fatRatio = 0.25      // 25% des calories
      break
    case 'MAINTAIN':
    default:
      // Répartition équilibrée
      proteinRatio = 0.30  // 30% des calories
      carbsRatio = 0.40    // 40% des calories
      fatRatio = 0.30      // 30% des calories
  }

  return {
    // Protéines: 4 kcal/g
    protein: Math.round((calories * proteinRatio) / 4),
    // Glucides: 4 kcal/g
    carbs: Math.round((calories * carbsRatio) / 4),
    // Lipides: 9 kcal/g
    fat: Math.round((calories * fatRatio) / 9)
  }
}

/**
 * Calcule toutes les métriques pour un utilisateur
 * @param weight - Poids en kg
 * @param height - Taille en cm
 * @param age - Âge en années
 * @param sex - Sexe
 * @param activityLevel - Niveau d'activité
 * @param goal - Objectif
 * @returns Objet complet avec toutes les métriques
 */
export function calculateAllMetrics(
  weight: number,
  height: number,
  age: number,
  sex: Sex,
  activityLevel: ActivityLevel,
  goal: Goal
) {
  const bmi = calculateBMI(weight, height)
  const bmr = calculateBMR(weight, height, age, sex)
  const tdee = calculateTDEE(bmr, activityLevel)
  const idealWeight = calculateIdealWeight(height, sex)
  const bodyFatPercent = estimateBodyFat(bmi, age, sex)
  const dailyCalories = calculateDailyCalories(tdee, goal)
  const macros = calculateMacros(dailyCalories, goal)

  return {
    bmi,
    bmr,
    tdee,
    idealWeight,
    bodyFatPercent,
    dailyCalories,
    dailyProtein: macros.protein,
    dailyCarbs: macros.carbs,
    dailyFat: macros.fat
  }
}

/**
 * Calcule l'âge à partir d'une date de naissance
 * @param dateOfBirth - Date de naissance
 * @returns Âge en années
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--
  }

  return age
}
