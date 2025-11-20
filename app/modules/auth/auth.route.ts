import { Router } from "express";
import { AuthController } from "./auth.controller";
import * as authValidation from "./auth.validation"
import { catchError } from "../../common/middleware/catch-error.middleware";

const router = Router();

router.post("/register", authValidation.registerValidation , catchError, AuthController.register);
router.post("/login", authValidation.loginValidation , catchError , AuthController.login);
router.get('/:id' , AuthController.fetchUser);

export default router;
