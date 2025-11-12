"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react"
import {
  basicInfoSchema,
  bodyMetricsSchema,
  activityGoalsSchema,
  preferencesSchema,
  type OnboardingInput,
} from "@/lib/validations/onboarding"
import { activityLevels } from "@/lib/mock-data"
import { WeightGoalSlider } from "@/components/onboarding/WeightGoalSlider"
import { type WeightGoalAnalysis } from "@/lib/nutrition/weight-goal-safety"

const STEPS = [
  { id: 1, title: "Informations de base", description: "Parlez-nous de vous" },
  { id: 2, title: "Mesures corporelles", description: "Votre poids et taille" },
  { id: 3, title: "Activité & Objectifs", description: "Vos habitudes et buts" },
  { id: 4, title: "Préférences", description: "Vos restrictions alimentaires" },
]

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<OnboardingInput>>({})

  const progress = (currentStep / STEPS.length) * 100

  // Step 1 form
  const step1Form = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: session?.user?.name || "",
      dateOfBirth: undefined,
      sex: undefined,
    },
  })

  // Step 2 form
  const step2Form = useForm({
    resolver: zodResolver(bodyMetricsSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
    },
  })

  // Step 3 form
  const step3Form = useForm({
    resolver: zodResolver(activityGoalsSchema),
    defaultValues: {
      activityLevel: undefined,
      goal: undefined,
      targetWeight: undefined,
    },
  })

  // Weight goal analysis state for step 3
  const [, setWeightGoalAnalysis] = useState<WeightGoalAnalysis | null>(null)

  // Memoize the callback to prevent re-renders
  const handleTargetWeightChange = useCallback((weight: number, analysis: WeightGoalAnalysis) => {
    step3Form.setValue("targetWeight", weight)
    setWeightGoalAnalysis(analysis)

    // Déduire automatiquement le goal basé sur l'analyse
    let goal: "LOSE_WEIGHT" | "MAINTAIN" | "GAIN_MUSCLE" = "MAINTAIN"
    if (analysis.weightChange < -0.5) {
      goal = "LOSE_WEIGHT"
    } else if (analysis.weightChange > 0.5) {
      goal = "GAIN_MUSCLE"
    }
    step3Form.setValue("goal", goal)
  }, [])

  // Step 4 form
  const step4Form = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      allergies: [],
      dislikes: [],
      dietType: "",
    },
  })

  const handleStep1Next = step1Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  })

  const handleStep2Next = step2Form.handleSubmit((data) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(3)
  })

  const handleStep3Next = step3Form.handleSubmit((data) => {
    // Le goal est déjà défini dans handleTargetWeightChange
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(4)
  })

  const handleStep4Submit = step4Form.handleSubmit(async (data) => {
    const completeData = { ...formData, ...data }
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("Failed to complete onboarding")
      }

      // Update session to reflect onboarding completion
      await update({ onboardingCompleted: true })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Onboarding error:", error)
      setIsSubmitting(false)
    }
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Configuration de votre profil</CardTitle>
              <CardDescription className="mt-1">
                Étape {currentStep} sur {STEPS.length}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {Math.round(progress)}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex gap-2 mt-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step.id < currentStep
                    ? "bg-chart-1"
                    : step.id === currentStep
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Next} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{STEPS[0].title}</h3>
                <p className="text-sm text-muted-foreground">{STEPS[0].description}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    {...step1Form.register("name")}
                  />
                  {step1Form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {step1Form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date de naissance</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...step1Form.register("dateOfBirth", {
                      setValueAs: (v) => (v ? new Date(v) : undefined),
                    })}
                  />
                  {step1Form.formState.errors.dateOfBirth && (
                    <p className="text-sm text-destructive">
                      {step1Form.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Sexe</Label>
                  <RadioGroup
                    onValueChange={(value) => step1Form.setValue("sex", value as "MALE" | "FEMALE" | "OTHER")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MALE" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer">
                        Homme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FEMALE" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer">
                        Femme
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer">
                        Autre
                      </Label>
                    </div>
                  </RadioGroup>
                  {step1Form.formState.errors.sex && (
                    <p className="text-sm text-destructive">
                      {step1Form.formState.errors.sex.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          {/* Step 2: Body Metrics */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Next} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{STEPS[1].title}</h3>
                <p className="text-sm text-muted-foreground">{STEPS[1].description}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="65"
                    {...step2Form.register("weight", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                  />
                  {step2Form.formState.errors.weight && (
                    <p className="text-sm text-destructive">
                      {step2Form.formState.errors.weight.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="170"
                    {...step2Form.register("height", {
                      setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                    })}
                  />
                  {step2Form.formState.errors.height && (
                    <p className="text-sm text-destructive">
                      {step2Form.formState.errors.height.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Activity & Goals */}
          {currentStep === 3 && (
            <form onSubmit={handleStep3Next} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{STEPS[2].title}</h3>
                <p className="text-sm text-muted-foreground">{STEPS[2].description}</p>
              </div>

              <div className="space-y-6">
                {/* Debug info */}
                {!formData.weight || !formData.height || !formData.sex ? (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Debug: Données manquantes
                    </p>
                    <ul className="text-xs mt-2 space-y-1">
                      <li>Poids: {formData.weight || "manquant"}</li>
                      <li>Taille: {formData.height || "manquante"}</li>
                      <li>Sexe: {formData.sex || "manquant"}</li>
                    </ul>
                  </div>
                ) : null}

                {/* Niveau d'activité */}
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Niveau d&apos;activité physique</Label>
                  <Controller
                    name="activityLevel"
                    control={step3Form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <div>
                                <div className="font-medium">{level.label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {level.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step3Form.formState.errors.activityLevel && (
                    <p className="text-sm text-destructive">
                      {step3Form.formState.errors.activityLevel.message}
                    </p>
                  )}
                </div>

                {/* Weight Goal Slider - Affiché seulement si on a le poids, taille et sexe */}
                {formData.weight && formData.height && formData.sex && (
                  <div className="space-y-2">
                    <WeightGoalSlider
                      currentWeight={formData.weight}
                      height={formData.height}
                      sex={formData.sex}
                      onTargetWeightChange={handleTargetWeightChange}
                    />
                    {step3Form.formState.errors.targetWeight && (
                      <p className="text-sm text-destructive">
                        {step3Form.formState.errors.targetWeight.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Objectif déduit automatiquement */}
                <input type="hidden" {...step3Form.register("goal")} />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Continuer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 4: Preferences (Optional) */}
          {currentStep === 4 && (
            <form onSubmit={handleStep4Submit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">{STEPS[3].title}</h3>
                <p className="text-sm text-muted-foreground">
                  {STEPS[3].description} (optionnel)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dietType">Type de régime (optionnel)</Label>
                  <Controller
                    name="dietType"
                    control={step4Form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Aucun régime spécifique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="vegetarian">Végétarien</SelectItem>
                          <SelectItem value="vegan">Végan</SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="paleo">Paleo</SelectItem>
                          <SelectItem value="mediterranean">Méditerranéen</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground">
                    💡 Vous pourrez ajouter vos allergies et préférences alimentaires plus tard
                    dans votre profil.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalisation...
                    </>
                  ) : (
                    <>
                      Terminer
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
