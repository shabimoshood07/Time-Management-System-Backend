import express from "express";
import {
  addWork,
  deleteWork,
  getAllWork,
  getWork,
  preferredWorkingHour,
  updateWork,
} from "../controller/workController.js";
import auth from "../middleware/authentication.js";
const router = express.Router();

router.post("/", auth, addWork);
router.get("/", auth, getAllWork);
router.get("/:workId", auth, getWork);
router.delete("/:workId", auth, deleteWork);
router.patch("/preferred-working-hours", auth, preferredWorkingHour);
router.patch("/:workId", auth, updateWork);

export default router;
