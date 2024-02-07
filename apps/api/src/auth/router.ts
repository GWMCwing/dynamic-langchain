import { Router } from "express";
import { login_cb } from "./login.js";
import { register_cb } from "./register.js";

const router: Router = Router();

router.post("/login", login_cb);
router.post("/register", register_cb);

export { router as authRouter };
