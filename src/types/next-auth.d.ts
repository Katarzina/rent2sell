import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  id: string
  role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    accessToken?: string
  }
}