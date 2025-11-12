"use client"

import { useState } from "react"
import { Nav } from "@/components/nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockUser, activityLevels, goals } from "@/lib/mock-data"
import { User, Activity, Target, TrendingUp, Scale, Ruler, Heart, Flame } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    weight: mockUser.weight.toString(),
    height: mockUser.height.toString(),
    activityLevel: mockUser.activityLevel,
    goal: mockUser.goal,
  })

  const handleSave = () => {
    console.log("Saving profile:", formData)
    setIsEditing(false)
    // En production, appeler l'API pour sauvegarder
  }

  const calculateAge = () => {
    const today = new Date()
    const birthDate = new Date(mockUser.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Insuffisance pondérale", color: "bg-warning/10 text-warning" }
    if (bmi < 25) return { label: "Poids normal", color: "bg-chart-1/10 text-chart-1" }
    if (bmi < 30) return { label: "Surpoids", color: "bg-warning/10 text-warning" }
    return { label: "Obésité", color: "bg-destructive/10 text-destructive" }
  }

  const bmiCategory = getBMICategory(mockUser.bmi)

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles et objectifs nutritionnels</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Modifier le profil</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave}>Sauvegarder</Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">
              <User className="h-4 w-4 mr-2" />
              Informations
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="h-4 w-4 mr-2" />
              Métriques
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="h-4 w-4 mr-2" />
              Objectifs
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Personal Information */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Vos données de base pour les calculs nutritionnels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <Input value={mockUser.dateOfBirth.toLocaleDateString("fr-FR")} disabled />
                    <p className="text-xs text-muted-foreground">Âge: {calculateAge()} ans</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Sexe</Label>
                    <Input value={mockUser.sex === "FEMALE" ? "Femme" : "Homme"} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mesures corporelles</CardTitle>
                <CardDescription>Poids et taille pour le calcul des métriques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                      <span className="flex items-center text-sm text-muted-foreground">kg</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Taille (cm)</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ruler className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          disabled={!isEditing}
                          className="pl-9"
                        />
                      </div>
                      <span className="flex items-center text-sm text-muted-foreground">cm</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Niveau d&apos;activité</CardTitle>
                <CardDescription>Influence votre dépense énergétique quotidienne</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => setFormData({ ...formData, activityLevel: value as typeof formData.activityLevel })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div>
                          <div className="font-medium">{level.label}</div>
                          <div className="text-xs text-muted-foreground">{level.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Health Metrics */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    IMC (Indice de Masse Corporelle)
                  </CardDescription>
                  <CardTitle className="text-4xl">{mockUser.bmi}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className={bmiCategory.color}>
                    {bmiCategory.label}
                  </Badge>
                  <Separator className="my-3" />
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Insuffisant</span>
                      <span>&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal</span>
                      <span>18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Surpoids</span>
                      <span>25 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Obésité</span>
                      <span>≥ 30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    BMR (Métabolisme de base)
                  </CardDescription>
                  <CardTitle className="text-4xl">{mockUser.bmr}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calories brûlées au repos par jour
                  </p>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">
                    Calculé avec la formule de Mifflin-St Jeor basée sur votre poids, taille, âge et sexe
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    TDEE (Dépense énergétique totale)
                  </CardDescription>
                  <CardTitle className="text-4xl">{mockUser.tdee}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Calories totales dépensées par jour
                  </p>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">
                    BMR × facteur d&apos;activité ({mockUser.activityLevel.toLowerCase()})
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Poids idéal (Lorentz)
                  </CardDescription>
                  <CardTitle className="text-4xl">{mockUser.idealWeight} kg</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Poids actuel:</span>
                    <span className="font-semibold">{mockUser.weight} kg</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-sm">
                    {mockUser.weight > mockUser.idealWeight ? (
                      <p className="text-warning">
                        À perdre: <span className="font-semibold">{(mockUser.weight - mockUser.idealWeight).toFixed(1)} kg</span>
                      </p>
                    ) : (
                      <p className="text-chart-1">Objectif atteint !</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Masse grasse estimée
                  </CardDescription>
                  <CardTitle className="text-4xl">{mockUser.bodyFatPercent}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {((mockUser.weight * mockUser.bodyFatPercent) / 100).toFixed(1)} kg de masse grasse
                  </p>
                  <Separator className="my-3" />
                  <div className="text-xs text-muted-foreground">
                    Estimation basée sur la formule de Jackson-Pollock
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardDescription>Masse maigre estimée</CardDescription>
                  <CardTitle className="text-4xl">
                    {(mockUser.weight - (mockUser.weight * mockUser.bodyFatPercent) / 100).toFixed(1)} kg
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Muscle, os, organes et eau
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Goals and Recommendations */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre objectif</CardTitle>
                <CardDescription>Définit votre apport calorique quotidien recommandé</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => setFormData({ ...formData, goal: value as typeof formData.goal })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        <div>
                          <div className="font-medium">{goal.label}</div>
                          <div className="text-xs text-muted-foreground">{goal.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectifs nutritionnels quotidiens</CardTitle>
                <CardDescription>Basé sur votre TDEE et objectif de {mockUser.goal === "LOSE_WEIGHT" ? "perte de poids" : mockUser.goal === "GAIN_MUSCLE" ? "prise de masse" : "maintien"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="text-2xl font-bold">{mockUser.dailyCalories} kcal</p>
                      </div>
                      <Flame className="h-8 w-8 text-chart-3" />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-chart-1/10">
                      <div>
                        <p className="text-sm text-muted-foreground">Protéines</p>
                        <p className="text-2xl font-bold text-chart-1">{mockUser.dailyProtein}g</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockUser.dailyProtein * 4) / mockUser.dailyCalories * 100).toFixed(0)}% des calories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-chart-3/10">
                      <div>
                        <p className="text-sm text-muted-foreground">Glucides</p>
                        <p className="text-2xl font-bold text-chart-3">{mockUser.dailyCarbs}g</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockUser.dailyCarbs * 4) / mockUser.dailyCalories * 100).toFixed(0)}% des calories
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-chart-5/10">
                      <div>
                        <p className="text-sm text-muted-foreground">Lipides</p>
                        <p className="text-2xl font-bold text-chart-5">{mockUser.dailyFat}g</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((mockUser.dailyFat * 9) / mockUser.dailyCalories * 100).toFixed(0)}% des calories
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Déficit calorique</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-primary mb-2">
                          -{mockUser.tdee - mockUser.dailyCalories} kcal/jour
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ce déficit de 20% vous permettra de perdre environ 0.5kg par semaine de manière saine et durable.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-chart-1/20 bg-chart-1/5">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Recommandations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-chart-1">•</span>
                          <p>Privilégiez les protéines maigres (poulet, poisson, œufs)</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-chart-1">•</span>
                          <p>Choisissez des glucides complexes (quinoa, riz complet)</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-chart-1">•</span>
                          <p>Incluez des graisses saines (avocat, noix, huile d&apos;olive)</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-chart-1">•</span>
                          <p>Restez hydraté avec 2-3L d&apos;eau par jour</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
