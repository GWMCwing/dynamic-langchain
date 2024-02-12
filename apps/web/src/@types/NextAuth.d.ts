import type { UserJWTData } from "@repo/api-types/data";

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface User extends UserJWTData {
    jwtToken: string;
  }
}
