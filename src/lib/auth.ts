import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo credentials for testing
        if (
          credentials?.email === "demo@shopverse.com" &&
          credentials?.password === "demo123"
        ) {
          return {
            id: "demo-user",
            name: "John Doe",
            email: "demo@shopverse.com",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
          };
        }

        // Simple validation — in production, this would check against a database
        if (credentials?.email && credentials?.password) {
          return {
            id: "user-" + Date.now(),
            name: (credentials.email as string).split("@")[0],
            email: credentials.email as string,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "shopverse-secret-key-change-in-production",
});
