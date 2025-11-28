"use client";
import { useState, useRef, useEffect } from "react";
import IngredientList from "./IngredientsList";
import Recipe from "./Recipe";

export default function MainContent() {

  const API_BASE = "https://ingreedyents-api.vercel.app";

  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  // ONE SINGLE INPUT STATE (correct)
  const [inputValue, setInputValue] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

  // AUTOCOMPLETE FETCH
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoadingSuggest(true);

      const res = await fetch(
        `${API_BASE}/api/autocomplete?query=${encodeURIComponent(inputValue)}`
      );

      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setLoadingSuggest(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [inputValue]);


  // API FOR RECIPE
  async function getRecipeOpenAI(ingredients) {
    try {
      const res = await fetch(
        `${API_BASE}/api/recipe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients })
        }
      );

      const data = await res.json();
      return data.recipe;

    } catch (err) {
      return "Error generating recipe.";
    }
  }


  // ADD INGREDIENT (correct logic)
  function handleSubmit(e) {
    e.preventDefault();

    const newIngredient = inputValue.trim();
    if (!newIngredient) return;

    const key = newIngredient.toLowerCase();

    if (ingredients.some(i => i.toLowerCase() === key)) {
      setNotification(`${newIngredient} is already in the list`);
      setSuggestions([]); 
      return;
    }

    setIngredients(prev => [...prev, newIngredient]);
    setInputValue("");              // clear input
    setSuggestions([]);             // remove suggestions
    setNotification("");
  }


  // GET RECIPE
  async function getRecipe() {
    if (ingredients.length === 0) return;

    setLoading(true);
    setRecipe("");

    const r = await getRecipeOpenAI(ingredients);
    setRecipe(r);

    setLoading(false);
  }


  return (
    <>
      <form onSubmit={handleSubmit} className="add-ingredient-form">

        <div className="autocomplete-wrapper">
          <input
            type="text"
            name="ingredient"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add ingredient..."
            autoComplete="off"
          />

          {loadingSuggest && (
            <div className="suggest-loading">Thinking…</div>
          )}

          {suggestions.length > 0 && (
            <ul className="suggestion-box">
              {suggestions.map((item, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setIngredients(prev => [...prev, item]);
                    setInputValue("");
                    setSuggestions([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">+ Add Ingredient</button>
      </form>

      {notification && <div className="notification">{notification}</div>}

      {ingredients.length > 0 && (
        <IngredientList ingredients={ingredients} getRecipe={getRecipe} />
      )}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Generating your recipe…</p>
        </div>
      ) : (
        recipe && <Recipe recipe={recipe} />
      )}
    </>
  );
}
