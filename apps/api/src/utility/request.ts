import type { Request, Response } from "express";

export function getUser(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  return req.user;
}
