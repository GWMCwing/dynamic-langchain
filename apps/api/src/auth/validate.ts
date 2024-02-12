import { Validate } from "@repo/api-types/route/auth";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility/reducer";
import { getDatabase } from "@repo/database";
import type { Request, Response } from "express";
import * as v from "valibot";

type ReqBodyDefinition = RequestBodyOf<Validate, "POST">;
type ResBodyDefinition = ResponseBodyOf<Validate, "POST">;

const bodySchema = v.object({
  userId: v.string(),
  sessionId: v.string(),
});

export async function validate_cb(
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
    const { userId, sessionId } = output satisfies ReqBodyDefinition;
    //
    const database = await getDatabase();
    const session = await database.user.getUserSession(userId, sessionId);
    if (!session) {
      return res.status(400).json({
        success: false,
        error: "Invalid Session",
      });
    }
    //
    const isValidSession =
      session.active && session.expiredAt.getTime() > Date.now();
    return res.status(200).json({
      success: true,
      valid: isValidSession,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
}
