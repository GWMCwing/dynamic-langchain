import { Router } from "express";
import { generationModelName_cb } from "./generationModel";

const router = Router();

router.get("/generationModels", generationModelName_cb);

export { router as langchainRouter };
