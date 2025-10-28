import { useState, useRef } from "react";
import IngredientList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";

export default function MainContent() {
  // ✅ Set your actual deployed backend URL
  const API_BASE = "https://ingreedyent-backend.vercel.app";

  // ✅ State for ingredients + recipe
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");

  const inputRef = useRef(null);

  // ✅ Fetch recipe from your backend (Hugging Face → Mistral)
  async function getRecipeFromMistral(ingredients) {
    try {
      const res = await fetch(`${API_BASE}/api/mistral`, {
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

  // ✅ Called when user clicks “Get Recipe” button
  async function getRecipe() {
    if (ingredients.length === 0) return;
    const recipeMarkdown = await getRecipeFromMistral(ingredients);
    setRecipe(recipeMarkdown);
  }

  // ✅ Handle adding ingredients
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

      {recipe && <ClaudeRecipe recipe={recipe} />}
    </>
  );
}
