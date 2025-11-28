import  './css/Header.css'

export default function IngredientList(props){
        
        const ingredientListItem = props.ingredients.map((ingredient,index)=>(
        <li key={`${ingredient}-${index}`} title="">{ingredient}</li>
        ))

return (
        <>
        {
            props.ingredients.length > 0  && <section className="ingredients-section">
            <h2>Ingredients on hand:</h2>
            <ul>
                {ingredientListItem}
            </ul> 
            </section>     
        }
        {   
            props.ingredients.length > 3 && <section className="ingredients-section"><div>
            <h3>Ready for a recipe?</h3>
            <p>Generate a recipe from your list of ingredients</p>
            </div>
            <button onClick={props.getRecipe}>Get a recipe</button>
            </section>
        }
        </>

)
}