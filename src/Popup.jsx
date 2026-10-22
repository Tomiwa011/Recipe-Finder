import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecipeDetail({ standalone = false }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecipe = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`Recipe request failed: ${response.status}`);
        }

        const data = await response.json();
        setRecipe(data.meals?.[0] || null);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setRecipe(null);
        setError("We couldn't load this recipe. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchRecipe();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (standalone) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") navigate(-1);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, standalone]);

  useEffect(() => {
    if (!standalone) closeButtonRef.current?.focus({ preventScroll: true });
  }, [standalone]);

  const handleClose = () => navigate(standalone ? "/" : -1);

  const instructions = recipe?.strInstructions
    ?.replace(/\s*step\s*(\d+)\s*/gi, (_, step) => `\n\nStep ${step}\n`)
    .trim();

  const ingredients = recipe
    ? Array.from({ length: 20 }, (_, index) => {
        const number = index + 1;
        const ingredient = recipe[`strIngredient${number}`]?.trim();
        const measure = recipe[`strMeasure${number}`]?.trim();
        return ingredient ? { ingredient, measure } : null;
      }).filter(Boolean)
    : [];

  const content = loading ? (
    <div className="recipe-status" role="status" aria-live="polite">
      <span className="recipe-loader" aria-hidden="true" />
      <h2 id="recipe-dialog-title">Finding the recipe...</h2>
      <p>Just a moment while we get everything ready.</p>
    </div>
  ) : !recipe ? (
    <div className="recipe-status" role="status">
      <span className="recipe-status-mark" aria-hidden="true">!</span>
      <h2 id="recipe-dialog-title">
        {error ? "A little kitchen hiccup" : "Recipe not found"}
      </h2>
      <p>{error || "This recipe may no longer be available."}</p>
    </div>
  ) : (
    <div className="recipe-details-content">
      <div className="recipe-hero">
        <img src={recipe.strMealThumb} alt="" />
        <div className="recipe-hero-shade" />
        <div className="recipe-title-block">
          <div className="recipe-meta">
            {recipe.strCategory && <span>{recipe.strCategory}</span>}
            {recipe.strArea && <span>{recipe.strArea}</span>}
          </div>
          <h2 id="recipe-dialog-title">{recipe.strMeal}</h2>
        </div>
      </div>

      <div className="recipe-body">
        {ingredients.length > 0 && (
          <aside className="recipe-ingredients">
            <p className="recipe-section-kicker">GET EVERYTHING READY</p>
            <h3>What you&apos;ll need</h3>
            <ul>
              {ingredients.map(({ ingredient, measure }, index) => (
                <li key={`${ingredient}-${index}`}>
                  <span>{ingredient}</span>
                  {measure && <span className="ingredient-measure">{measure}</span>}
                </li>
              ))}
            </ul>
          </aside>
        )}

        <section className="recipe-method">
          <p className="recipe-section-kicker">THE GOOD PART</p>
          <h3>Let&apos;s make it</h3>
          <p className="recipe-instructions">
            {instructions || "Instructions are not available for this recipe yet."}
          </p>
          {recipe.strYoutube && (
            <a
              className="recipe-video-link"
              href={recipe.strYoutube}
              target="_blank"
              rel="noreferrer"
            >
              Watch the recipe <span aria-hidden="true">↗</span>
            </a>
          )}
        </section>
      </div>
    </div>
  );

  const dialog = (
    <div
      className={`recipe-details${standalone ? " recipe-details-standalone" : ""}`}
      role="dialog"
      aria-modal={!standalone}
      aria-labelledby="recipe-dialog-title"
    >
      <button
        ref={closeButtonRef}
        className="recipe-close"
        type="button"
        onClick={handleClose}
        aria-label="Close recipe"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m7 7 10 10M17 7 7 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {content}
    </div>
  );

  if (standalone) {
    return <main className="container recipe-details-page">{dialog}</main>;
  }

  return (
    <div
      className="overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      {dialog}
    </div>
  );
}

export default RecipeDetail;
