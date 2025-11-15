import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, TrendingUp, Target, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Food Tracker</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/signin">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/register">
              <Button>S&apos;inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Titre principal */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Suivez votre nutrition avec{" "}
                <span className="text-primary">l&apos;IA</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Photographiez vos repas, obtenez une analyse nutritionnelle complète en quelques secondes
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  J&apos;ai déjà un compte
                </Button>
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <div className="p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Analyse par photo</h3>
                <p className="text-sm text-muted-foreground">
                  Prenez une photo de votre repas et laissez l&apos;IA identifier les aliments et calculer les calories
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Suivi personnalisé</h3>
                <p className="text-sm text-muted-foreground">
                  Suivez vos calories, protéines, glucides et lipides en temps réel selon vos objectifs
                </p>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Objectifs adaptatifs</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des recommandations personnalisées basées sur votre profil et vos objectifs
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Propulsé par <span className="font-semibold">Claude AI</span>{" "}
            <Sparkles className="h-4 w-4 inline" />
          </p>
        </div>
      </footer>
    </div>
  )
}
