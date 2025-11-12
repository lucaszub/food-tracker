// Mock data pour le user flow - Ne pas utiliser en production

export const mockUser = {
  id: "user_123",
  name: "Sophie Martin",
  email: "sophie.martin@example.com",
  dateOfBirth: new Date("1995-06-15"),
  sex: "FEMALE" as const,
  weight: 65, // kg
  height: 168, // cm
  activityLevel: "MODERATE" as const,
  goal: "LOSE_WEIGHT" as const,

  // Calculated metrics
  bmi: 23.0,
  bmr: 1445, // calories
  tdee: 2240, // calories
  idealWeight: 61.5, // kg
  bodyFatPercent: 24.5,

  // Daily targets
  dailyCalories: 1790, // 20% deficit for weight loss
  dailyProtein: 157, // g
  dailyCarbs: 179, // g
  dailyFat: 60, // g

  createdAt: new Date("2024-01-15"),
};

export const mockMeals = [
  {
    id: "meal_1",
    userId: "user_123",
    imageUrl: "/mock-breakfast.jpg",
    mealType: "BREAKFAST" as const,
    timestamp: new Date("2024-11-12T08:30:00"),
    totalCalories: 425,
    totalProtein: 28,
    totalCarbs: 45,
    totalFat: 15,
    confidence: 0.89,
    notes: "Petit-déjeuner équilibré avec bonnes sources de protéines",
    foods: [
      {
        id: "food_1",
        name: "Œufs brouillés",
        portion: "2 œufs (100g)",
        calories: 155,
        protein: 13,
        carbs: 1,
        fat: 11,
      },
      {
        id: "food_2",
        name: "Pain complet",
        portion: "2 tranches (60g)",
        calories: 140,
        protein: 6,
        carbs: 24,
        fat: 2,
      },
      {
        id: "food_3",
        name: "Avocat",
        portion: "1/2 avocat (50g)",
        calories: 80,
        protein: 1,
        carbs: 4,
        fat: 7,
      },
      {
        id: "food_4",
        name: "Jus d'orange",
        portion: "200ml",
        calories: 90,
        protein: 1,
        carbs: 20,
        fat: 0,
      },
    ],
  },
  {
    id: "meal_2",
    userId: "user_123",
    imageUrl: "/mock-lunch.jpg",
    mealType: "LUNCH" as const,
    timestamp: new Date("2024-11-12T12:45:00"),
    totalCalories: 620,
    totalProtein: 45,
    totalCarbs: 55,
    totalFat: 22,
    confidence: 0.92,
    notes: "Repas riche en protéines, bonne quantité de légumes",
    foods: [
      {
        id: "food_5",
        name: "Poulet grillé",
        portion: "150g",
        calories: 250,
        protein: 35,
        carbs: 0,
        fat: 11,
      },
      {
        id: "food_6",
        name: "Riz basmati",
        portion: "120g cuit",
        calories: 150,
        protein: 4,
        carbs: 35,
        fat: 0,
      },
      {
        id: "food_7",
        name: "Brocoli vapeur",
        portion: "150g",
        calories: 50,
        protein: 4,
        carbs: 10,
        fat: 0,
      },
      {
        id: "food_8",
        name: "Huile d'olive",
        portion: "1 cuillère (10ml)",
        calories: 90,
        protein: 0,
        carbs: 0,
        fat: 10,
      },
      {
        id: "food_9",
        name: "Salade verte",
        portion: "100g",
        calories: 20,
        protein: 2,
        carbs: 4,
        fat: 0,
      },
    ],
  },
  {
    id: "meal_3",
    userId: "user_123",
    imageUrl: "/mock-snack.jpg",
    mealType: "SNACK" as const,
    timestamp: new Date("2024-11-12T16:00:00"),
    totalCalories: 180,
    totalProtein: 8,
    totalCarbs: 22,
    totalFat: 7,
    confidence: 0.85,
    notes: "Collation saine et équilibrée",
    foods: [
      {
        id: "food_10",
        name: "Yaourt grec nature",
        portion: "150g",
        calories: 100,
        protein: 10,
        carbs: 5,
        fat: 5,
      },
      {
        id: "food_11",
        name: "Amandes",
        portion: "20g",
        calories: 120,
        protein: 5,
        carbs: 4,
        fat: 10,
      },
      {
        id: "food_12",
        name: "Myrtilles",
        portion: "50g",
        calories: 30,
        protein: 0,
        carbs: 8,
        fat: 0,
      },
    ],
  },
];

// Calcul des totaux de la journée
export const todayTotals = {
  calories: mockMeals.reduce((sum, meal) => sum + meal.totalCalories, 0),
  protein: mockMeals.reduce((sum, meal) => sum + meal.totalProtein, 0),
  carbs: mockMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0),
  fat: mockMeals.reduce((sum, meal) => sum + meal.totalFat, 0),
};

// Données d'historique sur 7 jours
export const weeklyData = [
  { date: "2024-11-06", calories: 1845, protein: 142, carbs: 185, fat: 68 },
  { date: "2024-11-07", calories: 1920, protein: 155, carbs: 178, fat: 72 },
  { date: "2024-11-08", calories: 1750, protein: 138, carbs: 168, fat: 65 },
  { date: "2024-11-09", calories: 2050, protein: 168, carbs: 195, fat: 78 },
  { date: "2024-11-10", calories: 1680, protein: 130, carbs: 155, fat: 62 },
  { date: "2024-11-11", calories: 1880, protein: 148, carbs: 182, fat: 70 },
  { date: "2024-11-12", calories: todayTotals.calories, protein: todayTotals.protein, carbs: todayTotals.carbs, fat: todayTotals.fat },
];

export const mockRecommendations = [
  {
    id: "rec_1",
    type: "info" as const,
    title: "Objectif calorique atteint à 68%",
    message: "Il vous reste environ 565 calories à consommer aujourd'hui. Privilégiez un dîner équilibré.",
    icon: "target",
  },
  {
    id: "rec_2",
    type: "success" as const,
    title: "Excellente progression cette semaine!",
    message: "Vous avez maintenu un déficit calorique de 18% en moyenne. Continuez comme ça!",
    icon: "trend-up",
  },
  {
    id: "rec_3",
    type: "warning" as const,
    title: "Attention aux protéines",
    message: "Vous êtes à 51% de votre objectif protéique. Ajoutez une source de protéines à votre prochain repas.",
    icon: "alert-circle",
  },
];

export const activityLevels = [
  { value: "SEDENTARY", label: "Sédentaire", description: "Peu ou pas d'exercice" },
  { value: "LIGHT", label: "Légère", description: "Exercice léger 1-3 jours/semaine" },
  { value: "MODERATE", label: "Modérée", description: "Exercice modéré 3-5 jours/semaine" },
  { value: "ACTIVE", label: "Active", description: "Exercice intense 6-7 jours/semaine" },
  { value: "VERY_ACTIVE", label: "Très active", description: "Exercice très intense quotidien" },
];

export const goals = [
  { value: "LOSE_WEIGHT", label: "Perte de poids", description: "Déficit calorique de 20%" },
  { value: "MAINTAIN", label: "Maintien", description: "Maintenir le poids actuel" },
  { value: "GAIN_MUSCLE", label: "Prise de masse", description: "Surplus calorique de 10%" },
];
