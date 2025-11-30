import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          return null
        }

        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) {
          console.error("ADMIN_PASSWORD not configured")
          return null
        }

        // Simple password comparison
        if (credentials.password === adminPassword) {
          return {
            id: "admin",
            name: "Admin",
            email: "admin@gallery.com"
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  debug: process.env.NODE_ENV === "development"
}

