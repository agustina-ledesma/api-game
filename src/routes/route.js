import express from "express";
import * as rankingController from "../controllers/rankingController.js";
import validateToken from "../middleware/validateToken.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});

const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "You have reached the request limit, please try again later.",
});

router.post(
  "/ranking",
  validateToken,
  limiter,
  rankingController.sendToRanking
);
router.get("/ranking", getLimiter, rankingController.getRanking);

export default router;
