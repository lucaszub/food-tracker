declare module "next-auth" {
  interface User {
    id: string
    onboardingCompleted?: boolean | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      onboardingCompleted?: boolean | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    onboardingCompleted?: boolean | null
  }
}
