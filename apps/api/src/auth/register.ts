import type { Register } from "@repo/api-types/route/auth";
import type { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility";
import type { Request, Response } from "express";
//
import { getDatabase } from "@repo/database";
import crypto from "crypto";
import * as v from "valibot";
import { hashPassword } from "../utility/hash.js";

type ReqBodyDefinition = RequestBodyOf<Register, "POST">;
type ResBodyDefinition = ResponseBodyOf<Register, "POST">;

const bodySchema = v.object({
  username: v.string(),
  password: v.string(),
});

export async function register_cb(
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
