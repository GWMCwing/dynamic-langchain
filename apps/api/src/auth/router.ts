import { Router } from "express";
import { login_cb } from "./login.js";
import { register_cb } from "./register.js";
import { validate_cb } from "./validate.js";

// path: /auth
const router: Router = Router();

router.post("/login", login_cb);
router.post("/register", register_cb);
router.post("/validate", validate_cb);

export { router as authRouter };
