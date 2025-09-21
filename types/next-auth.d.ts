import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      login?: string
      avatar_url?: string
      public_repos?: number
      followers?: number
      following?: number
      walletAddress?: string
    }
    accessToken?: string
  }

  interface User {
    id: string
    login?: string
    avatar_url?: string
    public_repos?: number
    followers?: number
    following?: number
    walletAddress?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    login?: string
    avatar_url?: string
    public_repos?: number
    followers?: number
    following?: number
    walletAddress?: string
  }
}