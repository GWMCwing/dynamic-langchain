import { getGenerationModelFactory } from "@repo/langchain";
import type { Request, Response } from "express";

export async function generationModelName_cb(req: Request, res: Response) {
  const result = (await getGenerationModelFactory()).getModelsName();
  res.status(200).json({ success: true, result });
}
