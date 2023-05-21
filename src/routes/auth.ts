import { Router } from "express";
// const authMiddleware = require("../middlewares/auth-middleware");
import authMiddleware from "../middlewares/auth-middleware";

import { signup, getUserInfo, login, logout } from "../controller/auth";

const router = Router();

router.post("/signup", signup);
router.get("/auth", authMiddleware, getUserInfo);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);

export default router;
