import { UserRole } from "@prisma/client"
import NextAuth, { type DefaultSession } from "next-auth"
import { AdapterUser } from "@auth/core/adapters"

export type ExtendedUser = DefaultSession["user"] & {
  id: string
  role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
    accessToken?: string
  }
  
  interface User extends AdapterUser {
    role: UserRole
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    accessToken?: string
    emailVerified?: Date | null
  }
}