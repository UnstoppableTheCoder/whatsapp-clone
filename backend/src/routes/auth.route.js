import express from "express";
import {
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// First Way ->
router.route("/register").post(trimRequest.all, register);
router.route("/login").post(trimRequest.all, login);
router.route("/logout").post(trimRequest.all, logout);
router.route("/refreshtoken").post(trimRequest.all, refreshToken);

// Testing Middleware Route
router
  .route("/testingMiddleware")
  .get(trimRequest.all, authMiddleware, (req, res) => {
    res.json(req.user);
  });

// Another way ->
// router.post("/register", register);

export default router;
