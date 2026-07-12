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
    <div className="container">
      <div className="app-container">
        <div className="header">
          <h2 className="title">What's Cooking?</h2>
          <p className="sub">
            Search for recipes you love from around the world
          </p>
        </div>

        <div className="search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="categories">
          <ul className="nav">
            {CATEGORIES.map((category) => (
             <li className={activeCategory === category ? "active" : ""}>
  <p onClick={() => handleCategoryClick(category)}>{category}</p>
</li>
            ))}
          </ul>
        </div>

        {loading ? (
          <div className="empty-state">Loading...</div>
        ) : recipes.length === 0 ? (
          <div className="empty-state">
            <h3>No recipes found</h3>
            <p>
              {error ||
                "Try another search term or choose a different category."}
            </p>
          </div>
        ) : (
          <div className="main">
            {recipes.map((recipe) => (
              <Link
                key={recipe.idMeal}
                to={`/recipe/${recipe.idMeal}`}
                state={{ backgroundLocation: location }}
                className="card"
              >
                <img
                  className="card-image"
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                />
                <h3>{recipe.strMeal}</h3>
                <span>View Details</span>
              </Link>
            ))}
          </div>
        )}
      </div>
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
