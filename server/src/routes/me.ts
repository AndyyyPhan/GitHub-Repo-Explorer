import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/meController.js";

export const meRouter = express.Router();

meRouter.use(authMiddleware);

meRouter.get("/favorites", getFavorites);
meRouter.post("/favorites", addFavorite);
meRouter.delete("/favorites/:id", removeFavorite);
