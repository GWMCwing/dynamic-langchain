import type { NextFunction, Request, Response } from "express";
import { decodeJWT } from "../utility/jwt.js";
import * as v from "valibot";
import { getDatabase } from "@repo/database";

const UserSchema = v.object({
  userId: v.string(),
});

export type User = v.Output<typeof UserSchema>;

export async function requireLogin_Middleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userJWT = req.headers.authorization?.split(" ")[1];
  if (!userJWT) return resUnAuth(res, "No user cookie or token found");
  //
  const user = await decodeJWT(userJWT);
  if (!user) return resUnAuth(res, "Invalid user cookie");
  //
  const result = v.safeParse(UserSchema, user);
  if (!result.success) return resUnAuth(res, "Invalid user cookie data");
  //
  const user_db = await (
    await getDatabase()
  ).user.getUser_id(result.output.userId);
  if (!user_db) return resUnAuth(res, "Invalid User");
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
