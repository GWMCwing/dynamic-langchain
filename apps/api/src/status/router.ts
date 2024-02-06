import { Router } from "express";
import { getMemoryStatus_cb } from "./memory";

const router: Router = Router();

router.get("/memory", getMemoryStatus_cb);

export { router as statusRouter };
