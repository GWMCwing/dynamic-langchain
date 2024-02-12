import { UserJWTData } from "@repo/api-types/data/UserJWT";
import { Login } from "@repo/api-types/route/auth";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility/reducer";
import { getDatabase } from "@repo/database";
import type { Request, Response } from "express";
import * as v from "valibot";
import { hashPassword } from "../utility/hash.js";
import { signJWT } from "../utility/jwt.js";

type ReqBodyDefinition = RequestBodyOf<Login, "POST">;
type ResBodyDefinition = ResponseBodyOf<Login, "POST">;

const bodySchema = v.object({
  username: v.string(),
  password: v.string(),
});

export async function login_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
  try {
    const { success, output, issues } = v.safeParse(bodySchema, req.body);
    if (!success) {
      console.log(issues);
      return res.status(400).json({
        success: false,
        error: "Incorrect Request Body",
      });
    }
    //
    const { username, password } = output satisfies ReqBodyDefinition;
    //
    const database = await getDatabase();
    const user = await database.user.getUser(username);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User Name Or Password Incorrect",
      });
    }

    const passwordSuccess =
      (await hashPassword(password, user.salt)) === user.passwordHash;
    //
    if (!passwordSuccess) {
      return res.status(400).json({
        success: false,
        error: "User Name Or Password Incorrect",
      });
    }
    //
    const newSession = await database.user.createUserSession(user.id);
    //
    const userJWTData = {
      userId: user.id,
      sessionId: newSession.id,
    };
    const userJWT = await signJWT<UserJWTData>(userJWTData);
    //
    // res.cookie("user", userJWTData, {
    //   httpOnly: true,
    //   sameSite: "strict",
    //   // secure: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 365,
    // });
    //
    return res.status(200).json({
      success: true,
      userData: userJWTData,
      token: userJWT,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
