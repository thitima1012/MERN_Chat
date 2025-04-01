import express from "express";
const router = express.Router();

import { getUsersForSidebar, getMessage, sendMessage } from "../controllers/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { checkFriendship } from "../middleware/friend.middleware.js";

router.get("/users", protectedRoute, getUsersForSidebar);
router.get("/:id", protectedRoute, getMessage);
router.post("/send/:id", protectedRoute, checkFriendship, sendMessage);

export default router;
