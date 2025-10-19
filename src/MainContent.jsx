import { useState,useRef } from "react"
import IngredientList from "./IngredientsList";
import ClaudeRecipe from "./ClaudeRecipe";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "./Ai"
import { getSecretKey } from "./Ai";

export default function MainContent(){

    const secretKey =  getSecretKey();
  if (!secretKey) {
    console.error("No secret key available!");
    return;
  }

  console.log(secretKey);

    const [ingredients,setIngredients]=useState([]);
 
    const [recipe, setRecipe] = useState("")
     const inputRef = useRef(null);
       async function getRecipe() {
       // setRecipeShown(prevShown => !prevShown)
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients,secretKey)
        setRecipe(recipeMarkdown)
    } 

    function handleSumbit(event){
        event.preventDefault();
  //  if (newIngredient.trim() === "") return; // prevent empty ingredient
        const formData= new FormData(event.currentTarget);
        const newIngredient = formData.get("ingredient");
         if (!newIngredient.trim()) return; // prevent empty input
        setIngredients(preIngredients =>[...preIngredients,newIngredient]);
       
         inputRef.current.value = '';
       /* ingredients.push(newIngredient)*/
       // console.log(ingredients)
    }
     
    return(
        <>
            <form onSubmit={handleSumbit} className="add-ingredient-form">
            <input type="text" ref={inputRef} placeholder="e.g Carrot" name="ingredient"/>
            <button >+ Add Ingredient</button>
            </form>
             { ingredients.length > 0  && <IngredientList ingredients={ingredients} getRecipe={getRecipe}/> }    
             { recipe &&  <ClaudeRecipe recipe={recipe}/>}
        </>
    )
}