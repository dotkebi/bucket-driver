import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AXIOS_INSTANCE } from "./src/api/mutator/custom-instance";

interface TokenWithRefresh {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  id?: string;
  error?: string;
  [key: string]: unknown;
}

async function refreshAccessToken(token: TokenWithRefresh): Promise<TokenWithRefresh> {
  try {
    const response = await AXIOS_INSTANCE.get("/api/auth/refresh-token", {
      params: { refreshToken: token.refreshToken },
    });

    if (response.data?.accessToken && response.data?.refreshToken) {
      return {
        ...token,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        accessTokenExpires: Date.now() + 60 * 60 * 1000,
      };
    }

    return token;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "driver-credentials",
      name: "Driver Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        verificationCode: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.username) {
          return null;
        }

        const username = credentials.username;
        const password = credentials.password;
        const verificationCode = credentials.verificationCode;

        try {
          if (verificationCode) {
            const response = await AXIOS_INSTANCE.post("/api/auth/verify-2fa", {
              username,
              verificationCode,
            });

            if (response.data?.accessToken && response.data?.refreshToken) {
              return {
                id: username,
                name: username,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
              };
            }

            return null;
          }

          const response = await AXIOS_INSTANCE.post("/api/auth/login", {
            username,
            password,
          });

          if (response.data?.requiresTwoFactor) {
            const err: any = new Error("TWO_FACTOR_REQUIRED");
            err.code = "TWO_FACTOR_REQUIRED";
            throw err;
          }

          if (response.data?.accessToken && response.data?.refreshToken) {
            return {
              id: username,
              name: username,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          console.error("Authentication failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;

        const accessToken = (user as any).accessToken as string | undefined;
        if (accessToken) {
          try {
            const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
            token.id = payload.user_id || payload.sub || payload.userId || token.id;
          } catch (e) {
            console.error("Failed to decode JWT:", e);
          }
        }
      }

      if (
        token.accessToken &&
        typeof token.accessTokenExpires === "number" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: (token.id as string) ?? session.user?.name ?? "",
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
