// Third-party Imports
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { LoginData, TokenData, NextAuthOptions, UserLoginData, } from "next-auth";
import { print } from "graphql";
import { LOGIN_MUTATION } from "@/gql/queries";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://pos_backend:3000/api-gateway";
        if (!url) {
          throw new Error("API URL is not configured");
        }

        try {
          // Step 1: Login with new Login mutation
          let response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: print(LOGIN_MUTATION),
              variables: {
                input: {
                  username: username,
                  password: password,
                },
              },
            }),
          });

          let result = await response.json();
          if (result.errors && result.errors.length > 0) {
            throw new Error(result.errors[0].message);
          }

          const loginData = result?.data?.login;
          if (!loginData) {
            throw new Error("Invalid credentials");
          }

          if (!loginData.isActive) {
            throw new Error("User account disabled");
          }

          const { _id, token, refreshToken, role } = loginData;

          // Return user data with new token format
          return {
            id: _id || username,
            user: {
              prefix: username,
              username: username,
              fNameLa: "",
              lNameLa: "",
              fNameEn: "",
              lNameEn: "",
              level: role, // Use role from backend
              business: null,
            },
            authorization: token,
            token: token,
            refreshToken: refreshToken,
            userId: _id,
          };
        } catch (e: any) {
          throw new Error(e.message);
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // ** 30 days
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const loginPayload = user as LoginData;

        // Ensure token.user object exists before assignment
        if (loginPayload.user) {
          token.user = loginPayload.user;
        }

        token.authorization = loginPayload.authorization;
        token.refreshToken = loginPayload.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user as UserLoginData;
        session.authorization = token.authorization;
      }
      return session;
    },
  },
};
