import type { Request, Response } from "express";

export async function getMemoryStatus_cb(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    memory: process.memoryUsage(),
  });
}
