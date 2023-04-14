import express from "express";
import { addWork, getAllWork, getWork } from "../controller/workController.js";
import auth from "../middleware/authentication.js";
const router = express.Router();

router.post("/", auth, addWork);
router.get("/", auth, getAllWork);
router.get("/:workId", auth, getWork);

export default router;
