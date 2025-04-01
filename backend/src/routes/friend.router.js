import express from "express";
import { addFriend, acceptFriend } from "../controllers/friend.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectedRoute, addFriend);
router.post("/accept", protectedRoute, acceptFriend);

export default router;