import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { env } from "../requiredEnv.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

const alg = "HS256";

export async function signJWT<T extends Record<any, any>>(info: T) {
  const jwt = await new SignJWT(info)
    .setProtectedHeader({ alg: alg })
    .setIssuedAt()
    .sign(secret);
  return jwt;
}

export async function decodeJWT(jwt: string) {
  try {
    const { payload, protectedHeader } = await jwtVerify(jwt, secret, {
      algorithms: [alg],
    });
    return payload;
  } catch (e) {
    console.log(e);
    return null;
  }
}
