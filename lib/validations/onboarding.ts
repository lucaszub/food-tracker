import { z } from "zod"

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dateOfBirth: z.date({
    message: "La date de naissance est requise",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear()
    return age >= 13 && age <= 120
  }, "Vous devez avoir entre 13 et 120 ans"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Le sexe est requis",
  }),
})

// Step 2: Body Metrics
export const bodyMetricsSchema = z.object({
  weight: z.number({
    message: "Le poids est requis",
  }).min(30, "Le poids doit être d'au moins 30 kg")
    .max(300, "Le poids doit être inférieur à 300 kg"),

  height: z.number({
    message: "La taille est requise",
  }).min(120, "La taille doit être d'au moins 120 cm")
    .max(250, "La taille doit être inférieure à 250 cm"),
})

// Step 3: Activity & Goals
export const activityGoalsSchema = z.object({
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"], {
    message: "Le niveau d'activité est requis",
  }),
  goal: z.enum(["LOSE_WEIGHT", "MAINTAIN", "GAIN_MUSCLE"], {
    message: "L'objectif est requis",
  }),
  targetWeight: z.number({
    message: "Le poids cible est requis",
  }).min(40, "Le poids cible doit être d'au moins 40 kg")
    .max(200, "Le poids cible doit être inférieur à 200 kg"),
})

// Step 4: Preferences (Optional)
export const preferencesSchema = z.object({
  allergies: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
  dietType: z.string().optional(),
})

// Complete onboarding schema
export const onboardingSchema = z.object({
  ...basicInfoSchema.shape,
  ...bodyMetricsSchema.shape,
  ...activityGoalsSchema.shape,
  ...preferencesSchema.shape,
})

export type BasicInfoInput = z.infer<typeof basicInfoSchema>
export type BodyMetricsInput = z.infer<typeof bodyMetricsSchema>
export type ActivityGoalsInput = z.infer<typeof activityGoalsSchema>
export type PreferencesInput = z.infer<typeof preferencesSchema>
export type OnboardingInput = z.infer<typeof onboardingSchema>
