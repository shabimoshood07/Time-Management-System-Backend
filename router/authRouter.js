import express from "express";
import { getUser, login, registerUser } from "../controller/authController.js";
import auth from "../middleware/authentication.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/user",auth, getUser);

export default router;
