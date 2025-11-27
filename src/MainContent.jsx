import { useState, useRef } from "react";
import IngredientList from "./IngredientsList";
import Recipe from "./Recipe";

export default function MainContent() {
  // deployed backend URL
  const API_BASE = "https://ingreedyents-api.vercel.app";

  // ingredients + recipe
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");

  const inputRef = useRef(null);

    async function getRecipeOpenAI(ingredients) {
    try {
      const res = await fetch("https://ingreedyents-api.vercel.app/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      return data.recipe;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return "Sorry, there was a problem getting your recipe.";
    }
  }


  // Called when user clicks “Get Recipe” button
  async function getRecipe() {
    if (ingredients.length === 0) return;
    const recipeMarkdown = await getRecipeOpenAI(ingredients);
    setRecipe(recipeMarkdown);
  }

  // Handle adding ingredients
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newIngredient = formData.get("ingredient");

    if (!newIngredient.trim()) return; // prevent empty input

    setIngredients((prev) => [...prev, newIngredient.trim()]);
    inputRef.current.value = ""; // clear input
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input
          type="text"
          ref={inputRef}
          placeholder="e.g. Carrot"
          name="ingredient"
        />
        <button type="submit">+ Add Ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientList ingredients={ingredients} getRecipe={getRecipe} />
      )}

      {recipe && <Recipe recipe={recipe} />}
    </>
  );
}
