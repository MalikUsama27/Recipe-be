import Recipe from "../models/Recipe.js";

export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user recipes", error: error.message });
  }
};

export const addRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, isPublic } = req.body;

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      createdBy: req.user.id,
      isPublic,
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Error adding recipe", error: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await recipe.deleteOne();
    res.json({ message: "Recipe removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting recipe", error: error.message });
  }
};

export const getPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public recipes", error: error.message });
  }
};

export const mixItUp = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    if (allRecipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    const ingredients = allRecipes.flatMap((r) => r.ingredients);
    const randomIngredients = [...new Set(ingredients)].sort(() => 0.5 - Math.random()).slice(0, 5);

    if (randomIngredients.length === 0) {
      return res.status(400).json({ message: "Not enough unique ingredients to create a mixed recipe" });
    }

    const instruction = generateCreativeInstructions(randomIngredients);

    res.json({ 
      title: "Mixed Recipe", 
      ingredients: randomIngredients, 
      instructions: instruction 
    });

  } catch (error) {
    res.status(500).json({ message: "Error generating mixed recipe", error: error.message });
  }
};

// Function to generate dynamic instructions based on ingredients
const generateCreativeInstructions = (ingredients) => {
  const cookingMethods = ["sauté", "grill", "boil", "bake", "stir-fry", "roast", "steam", "blend"];
  const spices = ["garlic", "ginger", "paprika", "cumin", "black pepper", "chili flakes", "basil", "oregano"];
  const randomMethod = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
  const randomSpice = spices[Math.floor(Math.random() * spices.length)];

  return `Start by ${randomMethod}ing ${ingredients[0]} with a pinch of ${randomSpice}. 
  Then, add ${ingredients.slice(1, -1).join(", ")}, stirring occasionally. 
  Finally, toss in ${ingredients[ingredients.length - 1]} for a delicious twist. 
  Enjoy your creative dish! 🍽️`;
};

