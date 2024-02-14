import { Login, Validate } from "@repo/api-types/route/auth";
import { AxiosFetch } from "@utility/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function validateSession(
  userId: string,
  sessionId: string,
): Promise<boolean> {
  try {
    const axios = AxiosFetch<Validate, "POST">(
      "POST",
      "/auth/validate",
      "json",
      {
        body: {
          userId: userId,
          sessionId: sessionId,
        },
      },
    );
    const { data } = await axios();

    return data.success || false;
  } catch (err) {
    console.warn("Error validating session");
    console.warn(err);
    return false;
  }
}

const authOptions: NextAuthOptions = {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // Validate the session
      const isValid = await validateSession(token.userId, token.sessionId);
      if (!isValid) {
        throw new Error("Invalid session");
      }
      session.user = token;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { username, password } = credentials;
        if (!username || !password) {
          return null;
        }
        //
        const { data } = await AxiosFetch<Login, "POST">(
          "POST",
          "/auth/login",
          "json",
          {
            body: { username: username, password: password },
            config: {
              validateStatus: (status) => status < 500,
            },
          },
        )();
        if (data.success === true)
          return {
            id: data.userData.userId,
            jwtToken: data.token,
            ...data.userData,
          };
        throw new Error(data.error);
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
