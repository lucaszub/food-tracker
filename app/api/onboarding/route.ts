import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { onboardingSchema } from "@/lib/validations/onboarding"
import { calculateAllMetrics, calculateAge } from "@/lib/nutrition/calculations"
import { analyzeWeightGoal } from "@/lib/nutrition/weight-goal-safety"

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await req.json()

    // Convert dateOfBirth string to Date object if needed
    if (body.dateOfBirth && typeof body.dateOfBirth === 'string') {
      body.dateOfBirth = new Date(body.dateOfBirth)
    }

    // Validate input
    const validatedData = onboardingSchema.parse(body)

    // Calculate age from date of birth
    const age = calculateAge(validatedData.dateOfBirth)

    // Calculate all nutritional metrics
    const metrics = calculateAllMetrics(
      validatedData.weight,
      validatedData.height,
      age,
      validatedData.sex,
      validatedData.activityLevel,
      validatedData.goal
    )

    // Analyze weight goal to calculate weekly rate and estimated target date
    const weightGoalAnalysis = analyzeWeightGoal(
      validatedData.weight,
      validatedData.targetWeight,
      validatedData.height,
      validatedData.sex
    )

    // Calculate estimated target date
    const estimatedTargetDate = new Date()
    estimatedTargetDate.setDate(estimatedTargetDate.getDate() + (weightGoalAnalysis.estimatedWeeks * 7))

    // Update user with profile data and calculated metrics
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        dateOfBirth: validatedData.dateOfBirth,
        sex: validatedData.sex,
        weight: validatedData.weight,
        height: validatedData.height,
        activityLevel: validatedData.activityLevel,
        goal: validatedData.goal,

        // Weight goal tracking
        targetWeight: validatedData.targetWeight,
        weeklyWeightChangeGoal: weightGoalAnalysis.weightChange >= 0
          ? weightGoalAnalysis.recommendedWeeklyRate
          : -weightGoalAnalysis.recommendedWeeklyRate,
        estimatedTargetDate: estimatedTargetDate,

        // Calculated metrics
        bmi: metrics.bmi,
        bmr: metrics.bmr,
        tdee: metrics.tdee,
        idealWeight: metrics.idealWeight,
        bodyFatPercent: metrics.bodyFatPercent,
        dailyCalories: metrics.dailyCalories,
        dailyProtein: metrics.dailyProtein,
        dailyCarbs: metrics.dailyCarbs,
        dailyFat: metrics.dailyFat,

        // Mark onboarding as completed
        onboardingCompleted: true,
      },
    })

    // Create user preferences if diet type is provided
    if (validatedData.dietType && validatedData.dietType !== "none") {
      await prisma.userPreferences.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          dietType: validatedData.dietType,
          allergies: JSON.stringify(validatedData.allergies || []),
          dislikes: JSON.stringify(validatedData.dislikes || []),
        },
        update: {
          dietType: validatedData.dietType,
        },
      })
    }

    // Create initial weight history entry
    await prisma.weightHistory.create({
      data: {
        userId: session.user.id,
        weight: validatedData.weight,
        notes: "Poids initial lors de l'inscription",
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        onboardingCompleted: updatedUser.onboardingCompleted,
        metrics: {
          bmi: metrics.bmi,
          bmr: metrics.bmr,
          tdee: metrics.tdee,
          idealWeight: metrics.idealWeight,
          bodyFatPercent: metrics.bodyFatPercent,
          dailyCalories: metrics.dailyCalories,
          dailyProtein: metrics.dailyProtein,
          dailyCarbs: metrics.dailyCarbs,
          dailyFat: metrics.dailyFat,
        },
      },
    })
  } catch (error) {
    console.error("Onboarding error:", error)

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    )
  }
}
