import { Router } from "express";
import { login_cb } from "./login";
import { register_cb } from "./register";

const router: Router = Router();

router.post("/login", login_cb);
router.post("/register", register_cb);

export { router as authRouter };
