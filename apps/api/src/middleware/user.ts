import type { NextFunction, Request, Response } from "express";
import { decodeJWT } from "../utility/jwt";
import * as v from "valibot";

const UserSchema = v.object({
  userId: v.string(),
});

export type User = v.Output<typeof UserSchema>;

export async function requireLogin_Middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { user: userJWT } = req.cookies;
  if (!userJWT) return resUnAuth(res, "1");
  //
  const user = await decodeJWT(userJWT);
  if (!user) return resUnAuth(res, "2");
  //
  const result = v.safeParse(UserSchema, user);
  if (!result.success) return resUnAuth(res, "3");
  //
  req.user = result.output;
  //
  next();
}

function resUnAuth(res: Response, logMessage: any = undefined) {
  logMessage !== undefined && console.log(logMessage);
  return res.status(401).json({
    success: false,
    error: "Unauthorized",
  });
}