import { getDatabase } from "@repo/database";
import type { Request, Response } from "express";
import { signJWT } from "../utility/jwt.js";
import crypto from "crypto";
import { hashPassword } from "../utility/hash.js";

export async function register_cb(
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
    if (await database.user.getUser(username)) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }
    //
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = await hashPassword(password, salt);

    const user = await database.user.createUser(username, passwordHash, salt);
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
