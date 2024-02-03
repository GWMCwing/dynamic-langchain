import type { Request, Response } from "express";
import { getGenerationModelFactory } from "langchain_local";

export async function generationModelName_cb(req: Request, res: Response) {
  const result = (await getGenerationModelFactory()).getModelsName();
  res.status(200).json({ success: true, result });
}