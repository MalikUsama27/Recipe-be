import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserRecipes, addRecipe, deleteRecipe, getPublicRecipes, mixItUp } from "../controllers/recipeController.js";

const router = express.Router();

router.get("/user", protect, getUserRecipes);
router.post("/add", protect, addRecipe);
router.delete("/:id", protect, deleteRecipe);
router.get("/public", getPublicRecipes);
router.get("/mix", mixItUp);

export default router;
