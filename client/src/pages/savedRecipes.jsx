import React, { useState, useEffect } from "react";
import { checkUser } from "../functions/checkUser";
import NavBar from "../components/nav-bar";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [token, setToken] = useState(null);

  const loadSavedRecipes = async (token) => {
    const savedRecipes = await fetchSavedRecipes(token); // Pass token to fetchSavedRecipes
    if (savedRecipes) {
      setRecipes(savedRecipes);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const tokenResult = await checkUser();
      if (tokenResult) {
        setToken(tokenResult);
        loadSavedRecipes(tokenResult); // Load recipes after token is fetched
      }
    };

    fetchToken();
  }, []); // Dependency array empty to run only on component mount

  const fetchSavedRecipes = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/saved-recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: token }), // Pass token in the request body
      });

      const result = await response.json();

      if (response.ok) {
        return result.saved_recipes || [];
      } else {
        console.error(`Error: ${result.message}`);
        return [];
      }
    } catch (error) {
      console.error("An error occurred while fetching saved recipes:", error);
      return [];
    }
  };

  const handleDelete = async (recipeId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!isConfirmed) {
      return; // Exit the function if the user cancels the deletion
    }

    try {
      const response = await fetch(
        "http://localhost:5000/delete-saved-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: recipeId }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
        setRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        ); // Remove deleted recipe from state
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="saved-recipes-container">
        <h2>Saved Recipes</h2>
        {recipes.length > 0 ? (
          <div className="saved-recipes-card-container">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="saved-recipe-card">
                <img
                  src={recipe.img.replace(/[\[\]"]/g, "")}
                  alt={recipe.title}
                />
                <h3 className="saved-recipe-card-title">{recipe.title}</h3>
                <p className="saved-recipe-card-time">Time: {recipe.time}</p>
                <p className="saved-recipe-card-serving">
                  Serving: {recipe.serving}
                </p>
                <p className="saved-recipe-card-rating">
                  Rating: {recipe.rating}/5
                </p>
                <a
                  href={recipe.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="saved-recipe-card-link"
                >
                  View Recipe
                </a>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No saved recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
