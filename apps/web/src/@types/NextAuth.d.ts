import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { UserJWTData } from "@repo/api-types/data";

type UserSessionData = DefaultSession["user"] &
  UserJWTData & {
    jwtToken: string;
  };

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface User extends UserSessionData {}

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {} & UserSessionData;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  // eslint-disable-next-line no-unused-vars
  interface JWT extends UserSessionData {}
}
