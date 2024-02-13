import { GenerationModel } from "@repo/api-types/route/langchain";
import { RequestBodyOf, ResponseBodyOf } from "@repo/api-types/utility/reducer";
import { getGenerationModelFactory } from "@repo/langchain";
import type { Request, Response } from "express";

type ReqBodyDefinition = RequestBodyOf<GenerationModel, "GET">;
type ResBodyDefinition = ResponseBodyOf<GenerationModel, "GET">;

export async function generationModelName_cb(
  req: Request,
  res: Response<ResBodyDefinition>,
): Promise<Response<ResBodyDefinition>> {
  try {
    const result = (await getGenerationModelFactory()).getModelsName();
    return res.status(200).json({ success: true, generationModelList: result });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
