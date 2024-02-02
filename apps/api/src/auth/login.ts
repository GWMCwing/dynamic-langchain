import { getDatabase } from "database";
import type { Request, Response } from "express";
import { signJWT } from "../utility/jwt";
import { hashPassword } from "../utility/hash";
import type { User } from "../middleware/user";

export async function login_cb(
  req: Request,
  res: Response,
): Promise<
  Response<
    | {
        success: false;
        error: string;
      }
    | {
        success: true;
      }
  >
> {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect Request Body" });
    }

    const database = await getDatabase();
    const user = await database.user.getUser(username);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User Name Or Password Incorrect",
      });
    }

    const success =
      (await hashPassword(password, user.salt)) === user.passwordHash;
    //
    if (!success) {
      return res.status(400).json({
        success: false,
        error: "User Name Or Password Incorrect",
      });
    }
    //
    const userJWTData = await signJWT<Pick<User, "userId">>({
      userId: user.id,
    });
    //
    res.cookie("user", userJWTData, {
      httpOnly: true,
      sameSite: "strict",
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    //
    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
