import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// @ts-expect-error - NextAuth types configuration
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
    verifyRequest: "/signin",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          onboardingCompleted: user.onboardingCompleted,
        }
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error - NextAuth types are complex
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.onboardingCompleted = user.onboardingCompleted
      }

      if (trigger === "update" && session) {
        token.onboardingCompleted = session.onboardingCompleted
      }

      return token
    },
    // @ts-expect-error - NextAuth types are complex
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.onboardingCompleted = token.onboardingCompleted
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
