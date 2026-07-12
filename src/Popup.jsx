import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecipeDetail({ standalone = false }) {
  // Reads the :id part of the URL, e.g. /recipe/52772 -> "52772"
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
        );
        const data = await response.json();
        setRecipe(data.meals?.[0] || null);
      } catch (err) {
        console.error(err);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // navigate(-1) goes back one step in history. Since we arrived here
  // via a Link (not a page reload), "back" just removes the overlay
  // and returns to whatever Home state was already there underneath.
  const handleClose = () => navigate(-1);

  const content = loading ? (
    <div className="recipe-status">Loading...</div>
  ) : !recipe ? (
    <div className="recipe-status">Recipe not found.</div>
  ) : (
    <div className="recipe-details-content">
      <div className="recipe-details-header">
        <h2>{recipe.strMeal}</h2>
        <button type="button" onClick={handleClose}>
          Close
        </button>
      </div>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <p>{recipe.strInstructions}</p>
    </div>
  );

  // Standalone mode (direct visit or refresh, no backgroundLocation):
  // render as a normal full page, no overlay styling.
  if (standalone) {
    return <div className="container recipe-details-page">{content}</div>;
  }

  // Popup mode: fixed overlay, click background to close, click card
  // content to do nothing (stopPropagation prevents the close-on-background
  // handler from firing when you're just clicking inside the card).
  return (
    <div className="overlay" onClick={handleClose}>
      <div className="recipe-details" onClick={(e) => e.stopPropagation()}>
        {content}
      </div>
    </div>
  );
}

export default RecipeDetail;
