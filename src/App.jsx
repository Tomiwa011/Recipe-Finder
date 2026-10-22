import { useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import RecipeDetail from "./Popup";

const CATEGORIES = ["Seafood", "Italian", "Vegetarian", "Dessert"];

function Home() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const location = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setActiveCategory(null);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setError("Unable to load recipes right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setQuery("");
    setActiveCategory(category);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`,
      );
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setError("Unable to load recipes right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Savour home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3v6m4-6v6M7 6h4m-2 3v12m8-18v18m0-18c2 2 3 4.4 3 7h-3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>SAVOUR<span className="brand-dot">.</span></span>
        </Link>
        <span className="topbar-note">A LITTLE INSPIRATION FOR EVERY MEAL</span>
        <a className="topbar-link" href="#recipes">
          Explore recipes
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M4 10h12m-5-5 5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">GOOD FOOD, NO GUESSWORK</p>
            <h1 id="hero-title">Make something <em>delicious.</em></h1>
            <p className="hero-description">
              A new favorite is closer than you think. Find something lovely to
              cook, whatever you&apos;re craving.
            </p>
            <a className="hero-link" href="#recipe-finder">
              Find your next favorite <span aria-hidden="true">↓</span>
            </a>
            <p className="hero-note">
              <strong>Fresh ideas,</strong> for the everyday cook.
            </p>
          </div>
          <div className="hero-visual" aria-label="A fresh, colorful meal">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
                alt="A colorful bowl of fresh vegetables and greens"
              />
            </div>
            <div className="hero-stamp" aria-label="Made with love">
              <span>Good</span>
              <small>things cook</small>
            </div>
          </div>
        </section>

        <section className="explore-section" id="recipe-finder">
          <div className="explore-inner">
            <div className="section-intro">
              <p className="eyebrow">WHAT ARE YOU CRAVING?</p>
              <h2>Let&apos;s find something good.</h2>
            </div>

            <div className="search">
              <form onSubmit={handleSearch} role="search">
                <label className="search-field">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle
                      cx="10.8"
                      cy="10.8"
                      r="6.8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="m16 16 4.2 4.2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="search"
                    aria-label="Search recipes"
                    placeholder="Try “pasta”, “chicken” or “curry”…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <button type="submit">Find recipes</button>
              </form>
            </div>

            <div className="category-row">
              <span className="category-label">EXPLORE BY MOOD</span>
              <ul className="nav" aria-label="Recipe categories">
                {CATEGORIES.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      className={activeCategory === category ? "active" : ""}
                      aria-pressed={activeCategory === category}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="recipes-section" id="recipes" aria-live="polite">
          <div className="results-heading">
            <div>
              <p className="eyebrow">
                {activeCategory ? "A LITTLE CATEGORY INSPIRATION" : query.trim() ? "YOUR SEARCH" : "READY WHEN YOU ARE"}
              </p>
              <h2>
                {activeCategory
                  ? `${activeCategory} recipes`
                  : query.trim()
                    ? `Recipes for “${query.trim()}”`
                    : "Recipes to fall for"}
              </h2>
            </div>
            {recipes.length > 0 && !loading && (
              <span className="result-count">
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="main" aria-label="Loading recipes">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="skeleton-card" key={index} aria-hidden="true">
                  <div className="skeleton-image" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="empty-state" role="status">
              <span className="empty-state-icon" aria-hidden="true">✳</span>
              <h3>
                {error
                  ? "The kitchen is taking a breather"
                  : query.trim() || activeCategory
                    ? "No recipes found just yet"
                    : "Your next meal starts here"}
              </h3>
              <p>
                {error ||
                  (query.trim() || activeCategory
                    ? "Try a different search or pick another category to find your next favorite."
                    : "Search for an ingredient or choose a category above to find a recipe worth making.")}
              </p>
            </div>
          ) : (
            <div className="main">
              {recipes.map((recipe) => (
                <Link
                  key={recipe.idMeal}
                  to={`/recipe/${recipe.idMeal}`}
                  state={{ backgroundLocation: location }}
                  className="recipe-card"
                  aria-label={`View recipe: ${recipe.strMeal}`}
                >
                  <div className="card-image-wrap">
                    <img
                      className="card-image"
                      src={recipe.strMealThumb}
                      alt=""
                      loading="lazy"
                    />
                    <span className="card-tag">A GOOD PLACE TO START</span>
                  </div>
                  <div className="card-content">
                    <h3>{recipe.strMeal}</h3>
                    <span className="card-action">
                      See the recipe <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail standalone />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
      )}
    </>
  );
}

export default App;
