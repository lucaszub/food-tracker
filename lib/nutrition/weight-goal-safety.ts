/**
 * Analyse de la sécurité et faisabilité des objectifs de poids
 * Basé sur les recommandations de l'OMS, ANSES et études scientifiques
 */

import { Sex } from './calculations'

/**
 * RÈGLES ET BONNES PRATIQUES (Documentation scientifique)
 *
 * 1. PERTE DE POIDS SAINE:
 *    - 0.5 kg/semaine = Optimal (préserve la masse musculaire, durable)
 *      Source: OMS, American Heart Association
 *    - 0.75 kg/semaine = Acceptable (nécessite un suivi nutritionnel)
 *    - >1 kg/semaine = Dangereux sauf obésité morbide avec suivi médical
 *      Risques: perte musculaire, carences, effet yo-yo, troubles métaboliques
 *
 * 2. GAIN DE MASSE MUSCULAIRE SAIN:
 *    - 0.25-0.5 kg/semaine = Optimal (minimise gain de graisse)
 *      Source: International Society of Sports Nutrition
 *    - >0.5 kg/semaine = Risque de prise de graisse excessive
 *
 * 3. LIMITES DE SÉCURITÉ (IMC):
 *    - IMC < 18.5: Insuffisance pondérale (risques santé)
 *    - IMC 18.5-24.9: Poids normal ✅
 *    - IMC 25-29.9: Surpoids
 *    - IMC ≥ 30: Obésité
 *
 * 4. LIMITES DE CHANGEMENT:
 *    - Ne pas viser ±20kg sans validation médicale
 *    - Ne pas descendre sous IMC 18.5 (sauf cas médical)
 *    - Alerte si objectif < poids idéal - 10kg
 */

export type WeightGoalSafety = 'safe' | 'moderate' | 'risky' | 'dangerous'

export interface WeightGoalAnalysis {
  // Résumé
  safety: WeightGoalSafety
  isRealistic: boolean

  // Calculs
  weightChange: number // kg (positif = gain, négatif = perte)
  targetBMI: number
  recommendedWeeklyRate: number // kg/semaine
  estimatedWeeks: number
  estimatedMonths: number

  // Messages
  mainMessage: string
  detailedMessages: string[]
  warnings: string[]
  recommendations: string[]

  // Données de référence
  currentBMI: number
  idealWeight: number
  minSafeWeight: number // IMC 18.5
  maxRecommendedChange: number // ±20kg
}

/**
 * Calcule le poids minimum sain basé sur IMC 18.5
 */
function calculateMinSafeWeight(height: number): number {
  const heightInMeters = height / 100
  return Math.round(18.5 * Math.pow(heightInMeters, 2) * 10) / 10
}

/**
 * Calcule le poids maximum recommandé basé sur IMC 30
 */
function calculateMaxSafeWeight(height: number): number {
  const heightInMeters = height / 100
  return Math.round(30 * Math.pow(heightInMeters, 2) * 10) / 10
}

/**
 * Calcule l'IMC
 */
function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100
  return Math.round((weight / Math.pow(heightInMeters, 2)) * 10) / 10
}

/**
 * Calcule le poids idéal (formule de Lorentz)
 */
function calculateIdealWeight(height: number, sex: Sex): number {
  if (sex === 'MALE') {
    return Math.round((height - 100 - ((height - 150) / 4)) * 10) / 10
  }
  // FEMALE ou OTHER
  return Math.round((height - 100 - ((height - 150) / 2.5)) * 10) / 10
}

/**
 * Analyse la sécurité et faisabilité d'un objectif de poids
 *
 * @param currentWeight - Poids actuel en kg
 * @param targetWeight - Poids cible en kg
 * @param height - Taille en cm
 * @param sex - Sexe
 * @returns Analyse complète de l'objectif
 */
export function analyzeWeightGoal(
  currentWeight: number,
  targetWeight: number,
  height: number,
  sex: Sex
): WeightGoalAnalysis {
  const weightChange = targetWeight - currentWeight
  const absWeightChange = Math.abs(weightChange)
  const isWeightLoss = weightChange < 0
  const isWeightGain = weightChange > 0

  const currentBMI = calculateBMI(currentWeight, height)
  const targetBMI = calculateBMI(targetWeight, height)
  const idealWeight = calculateIdealWeight(height, sex)
  const minSafeWeight = calculateMinSafeWeight(height)
  const maxSafeWeight = calculateMaxSafeWeight(height)

  // Déterminer le rythme recommandé selon l'objectif
  let recommendedWeeklyRate: number
  let safety: WeightGoalSafety
  const warnings: string[] = []
  const recommendations: string[] = []
  const detailedMessages: string[] = []

  if (isWeightLoss) {
    // PERTE DE POIDS
    if (absWeightChange <= 5) {
      // Petite perte: 0.5 kg/semaine optimal
      recommendedWeeklyRate = 0.5
      safety = 'safe'
    } else if (absWeightChange <= 10) {
      // Perte modérée: 0.5 kg/semaine recommandé
      recommendedWeeklyRate = 0.5
      safety = 'safe'
    } else if (absWeightChange <= 20) {
      // Perte importante: 0.5-0.75 kg/semaine
      recommendedWeeklyRate = 0.6
      safety = 'moderate'
      warnings.push('Objectif ambitieux qui nécessite un engagement sur plusieurs mois')
      recommendations.push('Consulter un nutritionniste pour un suivi personnalisé')
    } else {
      // Perte très importante: 0.5 kg/semaine max
      recommendedWeeklyRate = 0.5
      safety = 'risky'
      warnings.push('Objectif très ambitieux nécessitant un suivi médical')
      recommendations.push('Considérer des objectifs intermédiaires (par paliers de 10kg)')
      recommendations.push('Consulter un médecin avant de commencer')
    }

    // Vérifications de sécurité pour la perte de poids
    if (targetWeight < minSafeWeight) {
      safety = 'dangerous'
      warnings.push(`⚠️ Le poids cible (${targetWeight}kg) est sous le seuil de sécurité (IMC < 18.5)`)
      warnings.push('Risques: malnutrition, fatigue chronique, troubles hormonaux')
      recommendations.push(`Poids minimum recommandé: ${minSafeWeight}kg (IMC 18.5)`)
    }

    if (targetWeight < idealWeight - 10) {
      if (safety === 'safe') safety = 'moderate'
      warnings.push('Le poids cible est significativement sous votre poids idéal')
    }

    // Messages détaillés
    if (absWeightChange <= 10 && targetWeight >= minSafeWeight) {
      detailedMessages.push('✅ Objectif réaliste et sain')
      detailedMessages.push(`Perte: ${absWeightChange}kg`)
      detailedMessages.push(`Rythme recommandé: ${recommendedWeeklyRate}kg/semaine`)
      detailedMessages.push('💡 Ce rythme permet de préserver la masse musculaire et d\'ancrer de nouvelles habitudes durables')
    } else if (targetWeight >= minSafeWeight) {
      detailedMessages.push('⚠️ Objectif ambitieux')
      detailedMessages.push(`Perte totale: ${absWeightChange}kg`)
      detailedMessages.push('Un changement important demande du temps et de la persévérance')
    }

  } else if (isWeightGain) {
    // PRISE DE MASSE
    if (absWeightChange <= 5) {
      recommendedWeeklyRate = 0.35
      safety = 'safe'
    } else if (absWeightChange <= 10) {
      recommendedWeeklyRate = 0.35
      safety = 'safe'
      recommendations.push('Combiner avec un programme de musculation pour maximiser le gain musculaire')
    } else if (absWeightChange <= 15) {
      recommendedWeeklyRate = 0.4
      safety = 'moderate'
      warnings.push('Gain important: risque de prise de graisse si non accompagné d\'entraînement')
      recommendations.push('Programme de musculation structuré fortement recommandé')
    } else {
      recommendedWeeklyRate = 0.35
      safety = 'risky'
      warnings.push('Gain très important: risque élevé de prise de graisse excessive')
      recommendations.push('Considérer des objectifs par paliers avec réévaluation régulière')
      recommendations.push('Suivi avec un coach sportif et nutritionniste recommandé')
    }

    // Vérifications de sécurité pour le gain
    if (targetWeight > maxSafeWeight) {
      safety = 'dangerous'
      warnings.push(`⚠️ Le poids cible (${targetWeight}kg) dépasse le seuil de sécurité (IMC > 30)`)
      warnings.push('Risques: problèmes cardiovasculaires, diabète, hypertension')
      recommendations.push(`Poids maximum recommandé: ${maxSafeWeight}kg (IMC 30)`)
    }

    // Messages détaillés
    if (absWeightChange <= 10 && targetWeight <= maxSafeWeight) {
      detailedMessages.push('✅ Objectif de prise de masse réaliste')
      detailedMessages.push(`Gain: ${absWeightChange}kg`)
      detailedMessages.push(`Rythme optimal: ${recommendedWeeklyRate}kg/semaine`)
      detailedMessages.push('💡 Ce rythme minimise le gain de graisse et favorise la construction musculaire')
    }

  } else {
    // MAINTIEN (pas de changement)
    recommendedWeeklyRate = 0
    safety = 'safe'
    detailedMessages.push('✅ Maintien du poids actuel')
    detailedMessages.push('Focus sur l\'équilibre nutritionnel et la composition corporelle')
  }

  // Calcul de la durée
  const estimatedWeeks = recommendedWeeklyRate > 0
    ? Math.ceil(absWeightChange / recommendedWeeklyRate)
    : 0
  const estimatedMonths = Math.round((estimatedWeeks / 4.33) * 10) / 10

  // Message principal
  let mainMessage: string
  if (safety === 'safe') {
    mainMessage = isWeightLoss
      ? 'Objectif de perte de poids réaliste et sain'
      : isWeightGain
      ? 'Objectif de prise de masse réaliste'
      : 'Objectif de maintien'
  } else if (safety === 'moderate') {
    mainMessage = 'Objectif ambitieux mais réalisable avec engagement'
  } else if (safety === 'risky') {
    mainMessage = 'Objectif très ambitieux nécessitant un suivi professionnel'
  } else {
    mainMessage = 'Objectif présentant des risques pour la santé'
  }

  // Ajout de recommandations générales
  if (isWeightLoss && safety === 'safe') {
    recommendations.push('Maintenir un apport protéique suffisant (1.6-2g/kg)')
    recommendations.push('Pratiquer une activité physique régulière pour préserver la masse musculaire')
  }

  if (isWeightGain && safety === 'safe') {
    recommendations.push('Privilégier les aliments nutritifs et caloriques (noix, avocats, céréales complètes)')
    recommendations.push('Entraînement en résistance 3-4 fois par semaine')
  }

  return {
    safety,
    isRealistic: safety === 'safe' || safety === 'moderate',
    weightChange,
    targetBMI,
    recommendedWeeklyRate,
    estimatedWeeks,
    estimatedMonths,
    mainMessage,
    detailedMessages,
    warnings,
    recommendations,
    currentBMI,
    idealWeight,
    minSafeWeight,
    maxRecommendedChange: 20,
  }
}

/**
 * Obtient une couleur de badge selon le niveau de sécurité
 */
export function getSafetyColor(safety: WeightGoalSafety): 'default' | 'secondary' | 'destructive' {
  switch (safety) {
    case 'safe':
      return 'default' // Vert
    case 'moderate':
      return 'secondary' // Orange
    case 'risky':
    case 'dangerous':
      return 'destructive' // Rouge
  }
}

/**
 * Obtient une icône selon le niveau de sécurité
 */
export function getSafetyIcon(safety: WeightGoalSafety): string {
  switch (safety) {
    case 'safe':
      return '✅'
    case 'moderate':
      return '⚠️'
    case 'risky':
    case 'dangerous':
      return '❌'
  }
}
