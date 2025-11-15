"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Apple, Loader2, CheckCircle2 } from "lucide-react"
import { registerSchema, type RegisterInput } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password")

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Créer le compte
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Une erreur est survenue")
        setIsLoading(false)
        return
      }

      // 2. Authentifier automatiquement l'utilisateur après création du compte
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        setError("Compte créé mais erreur de connexion. Veuillez vous connecter.")
        setIsLoading(false)
        return
      }

      // 3. Rediriger vers dashboard (le middleware redirigera vers /onboarding si nécessaire)
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Une erreur est survenue lors de l'inscription")
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-lg bg-primary p-3">
              <Apple className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            Commencez votre suivi nutritionnel aujourd&apos;hui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                {...register("name")}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
              />
              {password && (
                <div className="space-y-2 mt-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength
                            ? passwordStrength === 1
                              ? "bg-destructive"
                              : passwordStrength === 2
                              ? "bg-warning"
                              : "bg-chart-1"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      {password.length >= 8 ? (
                        <CheckCircle2 className="h-3 w-3 text-chart-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                      )}
                      <span className={password.length >= 8 ? "text-chart-1" : "text-muted-foreground"}>
                        Au moins 8 caractères
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[A-Z]/.test(password) ? (
                        <CheckCircle2 className="h-3 w-3 text-chart-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                      )}
                      <span className={/[A-Z]/.test(password) ? "text-chart-1" : "text-muted-foreground"}>
                        Une majuscule
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/[0-9]/.test(password) ? (
                        <CheckCircle2 className="h-3 w-3 text-chart-1" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                      )}
                      <span className={/[0-9]/.test(password) ? "text-chart-1" : "text-muted-foreground"}>
                        Un chiffre
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte? </span>
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/terms" className="underline">conditions d&apos;utilisation</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
